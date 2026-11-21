import mongoose from "mongoose";
import { clerkClient } from "@clerk/express";
import User from "../models/User.js"
import Problems from "../models/Problems.js";

const LEVELS = ["SMP", "SMA"];

// level is stored as [] / [""] / ["SMP"], or as a plain string on some older problems
const problemLevels = (problem) => [].concat(problem.level || []).filter(Boolean);

/**
 * Admin: who finished which assignment. Problems with a deadline are grouped per deadline;
 * each group lists the students the problems are for (by level) and their status per problem.
 * status: "done" (solved by the deadline), "late" (solved after it), "tried" (attempted, not solved), "none".
 */
export const getAssignmentProgress = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });

    const [problems, students] = await Promise.all([
      Problems.find({ "deadline.0": { $exists: true } }, "problemId title difficulty difficultyLevel level deadline hidden").lean(),
      User.find({ role: { $ne: "Admin" }, hidden: { $ne: true } }, "name email profileImage level solvedProblems").lean(),
    ]);

    const groups = new Map();
    for (const p of problems) {
      const deadline = new Date([].concat(p.deadline)[0]);
      if (Number.isNaN(deadline.getTime())) continue;
      const key = deadline.toISOString();
      if (!groups.has(key)) groups.set(key, { deadline, problems: [] });
      groups.get(key).problems.push(p);
    }

    const result = [...groups.values()]
      .sort((a, b) => b.deadline - a.deadline)
      .map(({ deadline, problems: groupProblems }) => {
        groupProblems.sort((a, b) => (a.difficultyLevel || 0) - (b.difficultyLevel || 0) || a.title.localeCompare(b.title));
        const isFor = (problem, student) => {
          const levels = problemLevels(problem);
          return levels.length === 0 || levels.includes(student.level);
        };

        const rows = students
          .filter((s) => groupProblems.some((p) => isFor(p, s)))
          .map((s) => {
            const results = {};
            for (const p of groupProblems) {
              if (!isFor(p, s)) continue;
              const entry = (s.solvedProblems || []).find((sp) => sp.problem?.toString() === p._id.toString());
              let status = "none";
              if (entry?.solved) status = entry.submittedAt && new Date(entry.submittedAt) > deadline ? "late" : "done";
              // an entry is only created by a run, so any unsolved entry means the student tried
              else if (entry) status = "tried";
              results[p.problemId] = {
                status,
                at: entry?.solved ? entry.submittedAt : null,
                attempts: entry?.attempts || 0,
              };
            }
            return { _id: s._id, name: s.name, email: s.email, profileImage: s.profileImage, level: s.level || "", results };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        return {
          deadline,
          levels: [...new Set(groupProblems.flatMap(problemLevels))],
          problems: groupProblems.map((p) => ({
            problemId: p.problemId,
            title: p.title,
            difficulty: p.difficulty,
            levels: problemLevels(p),
            hidden: !!p.hidden,
          })),
          students: rows,
        };
      });

    return res.json({ groups: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard();
    return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Get Leaderboard error" });
  }
};

export const getUser = async (req, res)=>{
  try {
    return res.json({ user: req.user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Get User error"})
  }
}

// Students pick their level once (first-login popup); after that only an admin can change it,
// since the level decides which problems they see.
export const updateUserLevel = async (req, res)=>{
  try {
    const { level } = req.body
    const user = req.user;

    if (!LEVELS.includes(level)) return res.status(400).json({ message: "Invalid level" });
    if (user.level && user.role !== "Admin") {
      return res.status(403).json({ message: "Level already set. Ask your teacher to change it." });
    }

    user.level = level
    await user.save();

    return res.json({ message: "Level updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Level Error" });
  }
}

// ---------- Admin: manage users ----------

const requireAdmin = (req, res) => {
  if (req.user.role !== "Admin") {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
};

export const listUsers = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const users = await User.find({}, "name email profileImage role level hidden createdAt solvedProblems.solved")
      .sort({ createdAt: -1 })
      .lean();
    const result = users.map(({ solvedProblems = [], ...u }) => ({
      ...u,
      solvedCount: solvedProblems.filter((s) => s.solved).length,
    }));
    return res.json({ users: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserByAdmin = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, level, hidden } = req.body || {};

    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed || trimmed.length > 60) return res.status(400).json({ message: "Name must be 1-60 characters" });
      user.name = trimmed;
    }
    if (level !== undefined) {
      if (level !== "" && !LEVELS.includes(level)) return res.status(400).json({ message: "Invalid level" });
      user.level = level || undefined;
    }
    if (hidden !== undefined) {
      if (user._id.equals(req.user._id)) return res.status(400).json({ message: "You can't hide your own account" });
      user.hidden = !!hidden;
    }

    await user.save();
    return res.json({ message: "User updated", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// One student's work: every problem they ran code on, with their latest (or passing) code
export const getUserSubmissions = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id)
      .populate("solvedProblems.problem", "problemId title difficulty level hidden")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const submissions = (user.solvedProblems || [])
      .filter((s) => s.problem) // problem may have been deleted
      .map((s) => ({
        problemId: s.problem.problemId,
        title: s.problem.title,
        difficulty: s.problem.difficulty,
        problemHidden: !!s.problem.hidden,
        solved: !!s.solved,
        language: s.language,
        sourceCode: s.sourceCode,
        attempts: s.attempts || 0,
        submittedAt: s.submittedAt,
      }))
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    const { solvedProblems, clerkId, ...profile } = user;
    return res.json({ user: profile, submissions });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Deletes the account everywhere: Clerk (so they can't sign in again) and MongoDB (progress included).
export const deleteUserByAdmin = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid user id" });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "Admin") return res.status(400).json({ message: "Admin accounts can't be deleted here" });

    try {
      await clerkClient.users.deleteUser(user.clerkId);
    } catch (error) {
      // already gone from Clerk: still remove the MongoDB record
      if (error?.status !== 404) throw error;
    }
    await User.deleteOne({ _id: user._id });

    return res.json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
