import express from "express";
import {
  addProblem,
  updateProblem,
  submitProblem,
  getProblemById,
  getProblemForEdit,
  getProblems,
  getSolvedProblem
} from "../controllers/problemController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// GET API
router.get("/solved", protectRoute, getSolvedProblem);

router.get("/problem/:problemId/full", protectRoute, getProblemForEdit);
router.get("/problem/:problemId", getProblemById);
router.get("/problem", getProblems);

router.post("/problem/:problemId/submit", protectRoute, submitProblem);
router.post("/add", protectRoute, addProblem);
router.put("/problem/:problemId", protectRoute, updateProblem);

export default router;
