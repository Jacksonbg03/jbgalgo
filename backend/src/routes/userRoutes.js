import express from "express";
import {
  getLeaderboard,
  updateProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.post("/updateProfile", updateProfile);

export default router;
