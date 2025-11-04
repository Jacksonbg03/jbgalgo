import express from "express";
import {
  addProblem,
  submitProblem,
  getLeaderboard,
  getProblemById,
  getProblems,
  getSolvedProblem
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// GET API
// Ambil semua problem + status user
router.get("/problem/:userId/solved", getSolvedProblem);

router.get("/problem/:problemId", getProblemById);
router.get("/problem", getProblems);

// Tambah problem baru
// router.post("/add", addProblem);

// Submit jawaban user
// router.post("/problem/:problemId/submit", protectRoute, submitProblem);
router.post("/problem/:problemId/submit", submitProblem);


// // Ambil leaderboard
// router.get("/leaderboard", getLeaderboard);



export default router;
