import mongoose from "mongoose";
import Problem from "./src/models/Problems.js";
import { PROBLEMS } from "../frontend/src/data/problems.js"; // file statismu
import { ENV } from "./src/lib/env.js";

const MONGO_URI = ENV.DB_URL; // ganti sesuai DB-mu

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const problemsArray = Object.values(PROBLEMS);

    for (let p of problemsArray) {
      const exists = await Problem.findOne({ problemId: p.id });
      if (!exists) {
        await Problem.create({
          problemId: p.id,
          title: p.title,
          difficulty: p.difficulty,
          category: p.category,
          description: p.description,
          examples: p.examples,
          constraints: p.constraints,
          starterCode: p.starterCode,
          hiddenInputs: p.hiddenInputs,
          expectedOutput: p.expectedOutput,
        });
        console.log(`Seeded: ${p.title}`);
      }
    }

    console.log("All problems seeded");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
};

seed();