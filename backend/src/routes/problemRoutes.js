import express from "express";
import {
  addProblem,
  submitProblem,
  getUserProblems,
  getLeaderboard,
  getProblemById
} from "../controllers/problemController.js";

const router = express.Router();

// Tambah problem baru
router.post("/add", addProblem);

// Submit jawaban user
router.post("/submit", submitProblem);

// Ambil semua problem + status user
router.get("/:userId/problems", getUserProblems);

// Ambil leaderboard
router.get("/leaderboard", getLeaderboard);

router.get("/problems/problem/:id", getProblemById);

export default router;
