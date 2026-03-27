import User from "../models/User.js"

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
    const {userId} = req.params
    const user = await User.findOne({clerkId: userId});
    return res.json({user})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Get User error"})
  }
}

export const updateUserLevel = async (req, res)=>{
  try {
    const {userId, level} = req.body
    const user = await User.findOne({clerkId: userId});
    if (!user) return res.status(404).json({ message: "User not found" });

    user.level = level
    await user.save();

    return res.json({ message: "Level updated"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Update Level Error" });
  }
}
