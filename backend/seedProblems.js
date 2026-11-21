// Seeds problems into MongoDB. Problems whose problemId already exists are skipped.
// Usage (from the backend folder): npm run seed -- --set sesi1 --level SMP --deadline 2026-10-04
// --set: which problem set to seed (default sesi1, see problems/index.js).
// --level (SMP/SMA) optional; defaults to the set's LEVEL if it has one, otherwise the problems are for every level.
// --deadline (YYYY-MM-DD) optional, meaning the end of that day in Jakarta time; without it there is no deadline.
import mongoose from "mongoose";
import Problem from "./src/models/Problems.js";
import { ENV } from "./src/lib/env.js";
import { SETS } from "./problems/index.js";

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
};

const seed = async () => {
  const setName = arg("set") || "sesi1";
  const set = SETS[setName];
  if (!set) {
    console.error(`--set must be one of: ${Object.keys(SETS).join(", ")}`);
    process.exit(1);
  }
  const level = arg("level") || set.LEVEL;
  const deadlineArg = arg("deadline");
  if (level && !["SMP", "SMA"].includes(level)) {
    console.error("--level must be SMP or SMA");
    process.exit(1);
  }
  if (deadlineArg && !/^\d{4}-\d{2}-\d{2}$/.test(deadlineArg)) {
    console.error("--deadline must be YYYY-MM-DD");
    process.exit(1);
  }
  // same as the web form: the deadline is the end of that day in Jakarta time
  const deadline = deadlineArg ? `${deadlineArg}T23:59:59+07:00` : undefined;
  if (!ENV.DB_URL) {
    console.error("DB_URL is not set in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("MongoDB connected");

    console.log(`Set: ${setName}, level: ${level || "all"}, deadline: ${deadline || "-"}`);
    for (const p of set.PROBLEMS) {
      if (await Problem.exists({ problemId: p.problemId })) {
        console.log(`Skipped (already exists): ${p.title}`);
        continue;
      }
      await Problem.create({ ...p, level: level ? [level] : [], deadline: deadline ? [deadline] : [] });
      console.log(`Seeded: ${p.title}`);
    }

    console.log("All problems seeded");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
