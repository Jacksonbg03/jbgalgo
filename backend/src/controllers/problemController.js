import User from "../models/User.js";
import Problems from "../models/Problems.js";

export const addProblem = async (req, res) => {
  try {
    const data = req.body;
    const existing = await Problems.findOne({ problemId: data.problemId });
    if (existing) return res.status(400).json({ message: "Problem already exists" });

    const problem = await Problems.create(data);
    return res.status(201).json({ message: "Problem added", problem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitProblem = async (req, res) => {
  try {
    // const userId = "6908a0603f538a19ab1b3859"
    // const problemId = "two-sum"
    // const solved = true

    const { userId, problemId, solved } = req.body;

    const user = await User.findOne({clerkId: userId});
    if (!user) return res.status(404).json({ message: "User not found" });

    const problem = await Problems.findOne({ problemId: problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const existing = user.solvedProblems.find(
      (p) => p.problem.toString() === problem._id.toString()
    );

    if (existing) {
      existing.solved = solved || true;
    } else {
      user.solvedProblems.push({ problem: problem._id, solved: solved });
    }

    await user.save();
    return res.json({ message: "Problem updated", solvedProblems: user.solvedProblems });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSolvedProblem = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({clerkId: userId}).populate("solvedProblems.problem");
    if (!user) return res.status(404).json({ message: "User not found" });

    const problems = await Problems.find().sort({ difficultyLevel: 1, problemId: 1});
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
    if (!problemId) return res.status(400).json({ 
      error: `ProblemId is required: ${problemId}`
    });

    const problem = await Problems.findOne({ problemId });

    if (!problem) return res.status(404).json({ error: "Problem not found" });

    return res.json(problem);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProblems = async (req, res) =>{
  try {
    const problems = await Problems.find();
    if (!problems) return res.status(404).json({error: "Problems not found"})
    
      return res.json(problems)
  } catch (error) {
    return res.status(500).json({message: "Server error"})
  }
}