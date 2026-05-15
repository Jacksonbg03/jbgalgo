import express from "express";
import {
  addProblem,
  submitProblem,
  getProblemById,
  getProblems,
  getSolvedProblem
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// GET API
router.get("/problem/:userId/solved", getSolvedProblem);

router.get("/problem/:problemId", getProblemById);
router.get("/problem", getProblems);

router.post("/problem/:problemId/submit", protectRoute, submitProblem);
router.post("/add", protectRoute, addProblem);

export default router;
