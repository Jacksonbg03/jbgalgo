import express from "express";
import {
  getLeaderboard,
  getUser,
  updateUserLevel
} from "../controllers/userController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/:userId", getUser);
router.post("/level", updateUserLevel)

export default router;
