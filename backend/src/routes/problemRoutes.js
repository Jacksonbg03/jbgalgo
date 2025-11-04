import express from "express";
import {
  addProblem,
  submitProblem,
  getUserProblems,
  getLeaderboard,
  getProblemById,
  getProblems,
  getProblemsByUser
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Tambah problem baru
router.post("/add", addProblem);

// Submit jawaban user
router.post("/problem/:problemId/submit", protectRoute, submitProblem);

// Ambil semua problem + status user
router.get("/:userId/problems", getUserProblems);

// Ambil leaderboard
router.get("/leaderboard", getLeaderboard);

router.get("/problem/:problemId", getProblemById);
router.get("/problem", getProblems);

router.get("/problemss", protectRoute, getProblemsByUser);

export default router;
