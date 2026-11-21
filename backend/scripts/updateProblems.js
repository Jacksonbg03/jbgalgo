// Updates problems that already exist in MongoDB with the content from a problem set (text, examples, starter code, test cases).
// Level, deadline, hidden, problemId and students' solved records are left as they are.
// Always makes a full backup first.
// Usage (from the backend folder): node scripts/updateProblems.js --set string-smp [--confirm]
// Without --confirm it only lists what would change.
import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";
import Problems from "../src/models/Problems.js";
import { SETS } from "../problems/index.js";
import { backupAllCollections } from "./backup.js";

const CONTENT_FIELDS = ["title", "category", "description", "examples", "constraints", "starterCode", "hiddenInputs", "expectedOutput"];

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

const setName = arg("set");
const set = SETS[setName];
if (!set) {
  console.error(`--set must be one of: ${Object.keys(SETS).join(", ")}`);
  process.exit(1);
}
const confirm = process.argv.includes("--confirm");

await mongoose.connect(ENV.DB_URL);

const existing = await Problems.find({ problemId: { $in: set.PROBLEMS.map((p) => p.problemId) } }).lean();
const byId = new Map(existing.map((p) => [p.problemId, p]));
const toUpdate = set.PROBLEMS.filter((p) => byId.has(p.problemId));

for (const p of set.PROBLEMS) {
  const current = byId.get(p.problemId);
  console.log(current ? `Update: ${p.problemId} ("${current.title}" -> "${p.title}")` : `Not in database, skipped: ${p.problemId}`);
}

if (!confirm) {
  console.log("\nDry run. Run again with --confirm to apply.");
} else if (toUpdate.length > 0) {
  console.log("\nBacking up all collections...");
  const dir = await backupAllCollections();
  console.log(`Backup saved to: ${dir}`);

  for (const p of toUpdate) {
    const updates = Object.fromEntries(CONTENT_FIELDS.map((f) => [f, p[f]]));
    await Problems.updateOne({ problemId: p.problemId }, { $set: updates }, { runValidators: true });
  }
  console.log(`${toUpdate.length} problem(s) updated.`);
}

await mongoose.disconnect();
