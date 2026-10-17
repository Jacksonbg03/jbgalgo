import mongoose from "mongoose";
import { clerkClient } from "@clerk/express";
import User from "../models/User.js"

const LEVELS = ["SMP", "SMA"];

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
