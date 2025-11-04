import mongoose from "mongoose";

const problemsSchema = new mongoose.Schema(
  {
    problemId: { type: String, required: true, unique: true }, // ex: "two-sum"
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: [String], default: [] },
    description: {
      text: String,
      notes: [String],
    },
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    constraints: [String],
    starterCode: {
      javascript: String,
      python: String,
      java: String,
    },
    expectedOutput: {
      javascript: String,
      python: String,
      java: String,
    },
  },
  { timestamps: true }
);

const Problems = mongoose.model("Problem", problemsSchema);

export default Problems;
