import User from "../models/User.js";
import Problems from "../models/Problems.js";
import { runCode } from "../lib/codeRunner.js";

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

// Test cases are the answer key: never send them to students.
const HIDE_ANSWERS = "-hiddenInputs -expectedOutput";

const LANGUAGES = ["javascript", "python", "java"];

// same normalization the frontend used before grading moved to the server
const normalizeOutput = (output) =>
  output
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/\[\s+/g, "[")
        .replace(/\s+\]/g, "]")
        .replace(/\s*,\s*/g, ",")
    )
    .filter((line) => line.length > 0)
    .join("\n");

// Per-user submission limits: one run at a time, at most SUBMIT_LIMIT runs per window
const SUBMIT_LIMIT = 15;
const SUBMIT_WINDOW_MS = 60 * 1000;
const running = new Set();
const recentSubmits = new Map();

function checkSubmitLimit(userId) {
  if (running.has(userId)) return "Your previous run is still in progress.";
  const now = Date.now();
  const recent = (recentSubmits.get(userId) || []).filter((t) => now - t < SUBMIT_WINDOW_MS);
  if (recent.length >= SUBMIT_LIMIT) return "Too many runs. Please wait a minute and try again.";
  recent.push(now);
  recentSubmits.set(userId, recent);
  return null;
}

// Runs the code against the hidden test cases on the server and records the result.
export const submitProblem = async (req, res) => {
  const user = req.user;
  const userKey = user._id.toString();

  const { code, language } = req.body || {};
  if (!LANGUAGES.includes(language) || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ message: "Invalid code or language" });
  }

  const limitMessage = checkSubmitLimit(userKey);
  if (limitMessage) return res.status(429).json({ message: limitMessage });

  running.add(userKey);
  try {
    const problem = await Problems.findOne({ problemId: req.params.problemId });
    if (!problem || (problem.hidden && user.role !== "Admin")) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const inputs = problem.hiddenInputs || [];
    const expected = (problem.expectedOutput?.[language] || "").trim().split("\n");
    if (inputs.length === 0) {
      return res.json({ passed: false, outputs: [], error: "This problem has no test cases yet." });
    }

    const results = await Promise.all(inputs.map((input) => runCode(language, code, input.replace(/\\n/g, "\n"))));

    const outputs = [];
    let error = "";
    let passed = true;
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.error && result.error.trim() !== "") {
        error = result.error;
        passed = false;
        break;
      }
      const actual = (result.output || "").trim();
      outputs.push(actual);
      if (normalizeOutput(actual) !== normalizeOutput(expected[i] || "")) passed = false;
    }

    if (passed) {
      const existing = user.solvedProblems.find((p) => p.problem?.toString() === problem._id.toString());
      if (existing) {
        existing.sourceCode = code;
        existing.language = language;
        existing.solved = true;
        existing.submittedAt = new Date();
      } else {
        user.solvedProblems.push({ problem: problem._id, solved: true, sourceCode: code, language, submittedAt: new Date() });
      }
      await user.save();
    }

    return res.json({ passed, outputs, error });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    running.delete(userKey);
  }
};

// Full problem including test cases, for the admin edit form
export const getProblemForEdit = async (req, res) => {
  try {
    if (req.user.role !== "Admin") return res.status(403).json({ message: "Forbidden" });
    const problem = await Problems.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ message: "Problem not found" });
    return res.json(problem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSolvedProblem = async (req, res) => {
  try {
    const user = req.user;
    const solvedProblems = user.solvedProblems || [];

    const visibility = user.role === "Admin" ? {} : { hidden: { $ne: true } };
    const problems = await Problems.find(visibility).select(HIDE_ANSWERS).sort({ difficultyLevel: 1, problemId: 1});
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

    const problem = await Problems.findOne({ problemId }).select(HIDE_ANSWERS);

    if (!problem) return res.status(404).json({ error: "Problem not found" });

    // hidden problems are only visible to admins (this route is public, so check the optional Clerk session)
    if (problem.hidden) {
      const clerkId = req.auth?.()?.userId;
      const isAdmin = clerkId && (await User.exists({ clerkId, role: "Admin" }));
      if (!isAdmin) return res.status(404).json({ error: "Problem not found" });
    }

    return res.json(problem);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProblems = async (req, res) =>{
  try {
    const problems = await Problems.find({ hidden: { $ne: true } }).select(HIDE_ANSWERS).sort({ difficultyLevel: 1, problemId: 1});
    return res.json(problems);
  } catch (error) {
    return res.status(500).json({message: "Server error"})
  }
}