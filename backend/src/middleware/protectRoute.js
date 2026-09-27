import { clerkClient, requireAuth } from "@clerk/express";
import User from "../models/User.js";

// New Clerk accounts were meant to be synced to MongoDB by the Inngest webhook, which is disabled.
// Create the MongoDB user on first authenticated request instead.
async function findOrCreateUser(clerkId) {
  const existing = await User.findOne({ clerkId });
  if (existing) return existing;

  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || email || "Student";

  // same email but a new Clerk account (e.g. account re-created): link it to the existing record
  if (email) {
    const byEmail = await User.findOneAndUpdate({ email }, { clerkId }, { new: true });
    if (byEmail) return byEmail;
  }

  try {
    return await User.create({ clerkId, email, name, profileImage: clerkUser.imageUrl || "" });
  } catch (error) {
    // two requests raced to create the same user
    if (error.code === 11000) return User.findOne({ clerkId });
    throw error;
  }
}

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

      const user = await findOrCreateUser(clerkId);

      if (!user) return res.status(404).json({ message: "User not found" });

      // attach user to req
      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
];
