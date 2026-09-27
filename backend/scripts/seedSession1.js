// Menambahkan soal Sesi 1 (Algoritma & Coding). Soal yang problemId-nya sudah ada akan dilewati.
// Usage (dari folder backend): node scripts/seedSession1.js --level SMP --deadline 2026-10-04
// --level dan --deadline opsional (tanpa keduanya soal tidak punya deadline).
import mongoose from "mongoose";
import { ENV } from "../src/lib/env.js";
import Problems from "../src/models/Problems.js";
import { SESSION1_PROBLEMS } from "./data/session1Problems.js";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

const level = arg("level");
const deadline = arg("deadline");
if (level && !["SMP", "SMA"].includes(level)) {
  console.error("--level harus SMP atau SMA");
  process.exit(1);
}

await mongoose.connect(ENV.DB_URL);

for (const problem of SESSION1_PROBLEMS) {
  if (await Problems.exists({ problemId: problem.problemId })) {
    console.log(`Lewati (sudah ada): ${problem.title}`);
    continue;
  }
  await Problems.create({
    ...problem,
    level: level ? [level] : [],
    deadline: deadline ? [deadline] : [],
  });
  console.log(`Ditambahkan: ${problem.title}`);
}

await mongoose.disconnect();
