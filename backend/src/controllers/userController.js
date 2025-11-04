import User from "../models/User.js"

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