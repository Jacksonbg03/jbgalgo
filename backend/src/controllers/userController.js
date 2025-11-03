import User from "../models/User.js"
import Problem from "../models/Problems.js";

// 1️⃣ Submit jawaban
export const submitProblem = async (req, res) => {
  try {
    const { userId, problemId, solved } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const problem = await Problem.findOne({ problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    // Cek apakah problem sudah ada di solvedProblems
    const existing = user.solvedProblems.find(
      (p) => p.problem.toString() === problem._id.toString()
    );

    if (existing) {
      // Update solved status
      existing.solved = solved;
    } else {
      // Tambah baru
      user.solvedProblems.push({
        problem: problem._id,
        solved,
      });
    }

    await user.save();

    return res.json({ message: "Problem updated", solvedProblems: user.solvedProblems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 2️⃣ Ambil leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard(10);
    return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Ambil status soal user
export const getUserProblems = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("solvedProblems.problem");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ solvedProblems: user.solvedProblems });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
