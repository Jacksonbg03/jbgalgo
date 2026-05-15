import express from "express";
import {
  getLeaderboard,
  getUser,
  updateUserLevel
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/:userId", getUser);
router.post("/level", protectRoute, updateUserLevel);

export default router;
