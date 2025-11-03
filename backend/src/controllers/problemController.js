import User from "../models/User.js";
import Problems from "../models/Problems.js";

// Tambah problem baru (admin)
export const addProblem = async (req, res) => {
  try {
    const data = req.body;
    const existing = await Problem.findOne({ problemId: data.problemId });
    if (existing) return res.status(400).json({ message: "Problem already exists" });

    const problem = await Problem.create(data);
    return res.status(201).json({ message: "Problem added", problem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Submit jawaban user
export const submitProblem = async (req, res) => {
  try {
    const { userId, problemId, solved } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const problem = await Problem.findOne({ problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const existing = user.solvedProblems.find(
      (p) => p.problem.toString() === problem._id.toString()
    );

    if (existing) {
      existing.solved = solved;
    } else {
      user.solvedProblems.push({ problem: problem._id, solved });
    }

    await user.save();
    return res.json({ message: "Problem updated", solvedProblems: user.solvedProblems });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Ambil semua problem dengan status user
export const getUserProblems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("solvedProblems.problem");
    if (!user) return res.status(404).json({ message: "User not found" });

    const problems = await Problem.find();

    // Gabungkan dengan solved status user
    const results = problems.map((p) => {
      const status = user.solvedProblems.find(
        (up) => up.problem._id.toString() === p._id.toString()
      );
      return {
        ...p._doc,
        solved: status ? status.solved : false,
      };
    });

    return res.json({ problems: results });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard(10);
    return res.json({ leaderboard });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problems.findOne({ problemId });
    console.log("AHAII")
    console.log(problem)
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    return res.json(problem);
  } catch (err) {
    console.error("INI DIA ERROR: ",err);
    return res.status(500).json({ message: "Server error" });
  }
};