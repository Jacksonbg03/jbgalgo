import User from "../models/User.js"

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard(10);
    return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req, res)=>{
  try {
    const {userId} = req.params
    const user = await User.findOne({clerkId: userId});
    return res.json({user})
  } catch (error) {
    console.error(error)
    return res.status(500).json({message: "Server error"})
  }
}
