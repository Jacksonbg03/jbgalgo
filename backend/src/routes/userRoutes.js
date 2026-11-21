import express from "express";
import {
  getLeaderboard,
  getUser,
  updateUserLevel,
  listUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getUserSubmissions,
  getAssignmentProgress
} from "../controllers/userController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
// only the signed-in user's own data (email, saved code) is returned
router.get("/me", protectRoute, getUser);
router.post("/level", protectRoute, updateUserLevel);

// admin: manage users
router.get("/admin/users", protectRoute, listUsers);
router.get("/admin/users/:id/submissions", protectRoute, getUserSubmissions);
router.patch("/admin/users/:id", protectRoute, updateUserByAdmin);
router.delete("/admin/users/:id", protectRoute, deleteUserByAdmin);
// admin: who finished which assignment
router.get("/admin/assignments", protectRoute, getAssignmentProgress);

export default router;
