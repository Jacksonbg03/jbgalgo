import express from "express";
import {
  submitProblem,
  getLeaderboard,
  getUserProblems,
} from "../controllers/userController.js";

const router = express.Router();

// Submit jawaban / update solved status
router.post("/submit", submitProblem);

// Ambil leaderboard
router.get("/leaderboard", getLeaderboard);

// Ambil status soal user
router.get("/:userId/problems", getUserProblems);

export default router;
