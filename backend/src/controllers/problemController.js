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
    const clerkId = req.user.clerkId
    // const { userId, problemId, solved } = req.body;
    return res.status(200).json({aduha: "IAJDIAJ"})

    const user = await User.findById({clerkId});
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

export const getProblemsByUser = async (req, res) =>{
  try {

    // const {clerkId, solved, difficulty, category} = req.query;
    const clerkId = req.user.clerkId
    const user = await User.findOne({clerkId}).populate("solvedProblems", "problem solved");
    
    return res.status(200).json({user:user})
    // const user = await User.findOne({clerkId}).populate("solvedProblems.problem")

    if(!user){
      return res.status(404).json({message: `User not found ${clerkId} ${solved} ${difficulty}`})
    }

    let query = {}
    if (difficulty) query.difficulty = difficulty
    if (category) query.category = category

    const allProblems = await Problems.find();
    if (!problems) return res.status(404).json({error: "Problems not found"})

    const solvedId = user.solvedProblems.filter((p)=>p.solved).map((p)=>p._id.toString());

    // Kalau user mau filter berdasarkan solved / unsolved
    let filteredProblems = problemsWithStatus;
    if (solved === "true") {
      filteredProblems = problemsWithStatus.filter((p) => p.solved);
    } else if (solved === "false") {
      filteredProblems = problemsWithStatus.filter((p) => !p.solved);
    }

    res.json(filteredProblems);
  } catch (error) {
    res.status(500).json({message: "Server error"})
  }
}