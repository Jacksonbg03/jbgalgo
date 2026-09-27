import User from "../models/User.js";
import Problems from "../models/Problems.js";

export const addProblem = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });

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

const EDITABLE_FIELDS = [
  "title",
  "difficulty",
  "difficultyLevel",
  "category",
  "description",
  "examples",
  "constraints",
  "starterCode",
  "hiddenInputs",
  "expectedOutput",
  "deadline",
  "level",
  "hidden",
];

export const updateProblem = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });

    // problemId stays the same so problem URLs and users' solved records keep working
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const problem = await Problems.findOneAndUpdate({ problemId: req.params.problemId }, updates, {
      new: true,
      runValidators: true,
    });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    return res.json({ message: "Problem updated", problem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const submitProblem = async (req, res) => {
  try {
    const { problemId, solved, sourceCode, language } = req.body;
    const user = req.user;

    const problem = await Problems.findOne({ problemId: problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const existing = user.solvedProblems.find(
      (p) => p.problem.toString() === problem._id.toString()
    );

    if (existing) {
      existing.sourceCode = sourceCode;
      existing.language = language;
      existing.solved = true;
      existing.submittedAt = new Date()
    } else { user.solvedProblems.push({
        problem: problem._id,
        solved: solved,
        sourceCode,
        language,
        submittedAt: new Date()
      });
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
    // a brand-new account may not be in MongoDB yet (it is created on its first authenticated request)
    const user = await User.findOne({clerkId: userId});
    const solvedProblems = user?.solvedProblems || [];

    const visibility = user?.role === "Admin" ? {} : { hidden: { $ne: true } };
    const problems = await Problems.find(visibility).sort({ difficultyLevel: 1, problemId: 1});
    const results = problems.map((p) => {
      const status = solvedProblems.find(
          (up) => up.problem?.toString() === p._id.toString()
      );
      return {
        ...p._doc,
        solved: status ? status.solved : false,
        saveLanguageUser: status && status?.language ? status.language : "",
        saveSourceCode: status && status?.sourceCode ? status.sourceCode : ""
      };
    });

    return res.json({ problems: results });
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
    const problems = await Problems.find({ hidden: { $ne: true } }).sort({ difficultyLevel: 1, problemId: 1});
    return res.json(problems);
  } catch (error) {
    return res.status(500).json({message: "Server error"})
  }
}