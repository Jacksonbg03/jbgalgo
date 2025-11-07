import express from "express";
import {
  getLeaderboard,
  getUser
} from "../controllers/userController.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/:userId", getUser);

export default router;
