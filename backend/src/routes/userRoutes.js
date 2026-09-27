import express from "express";
import {
  getLeaderboard,
  getUser,
  updateUserLevel
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
// only the signed-in user's own data (email, saved code) is returned
router.get("/me", protectRoute, getUser);
router.post("/level", protectRoute, updateUserLevel);

export default router;
