import User from "../models/User.js"
import crypto from "crypto";

// 2️⃣ Ambil leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.getLeaderboard(10);
    return res.json({ leaderboard });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async(req, res)=>{
  try {
    const signature = req.headers["clerk-signature"];
    const payload = req.body.toString();
    
    
    // verifikasi signature
    const expectedSignature = crypto
    .createHmac("sha256", process.env.CLERK_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");
    
    if (signature !== expectedSignature) {
      return res.status(401).send("Invalid signature");
    }
    
    const event = JSON.parse(payload);
    // const event = req.body
    
    
    if (event.type === "user.updated") {
      const { id, full_name, email_addresses } = event.data;
      const email = email_addresses?.[0]?.email_address || "unknown@example.com";
      
      await User.findOneAndUpdate(
        { clerkId: id },
        { name: full_name, email },
        { new: true, upsert: true }
      );

      console.log(`User ${id} updated in MongoDB`);
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
}