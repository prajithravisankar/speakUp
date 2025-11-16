import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const router = Router();

// Define the route for GET /api/me
router.get("/", protect, async (req, res) => {
  try {
    // By the time we get here, 'protect' has already verified the token
    // and attached the user's Clerk ID to req.userId.
    const userId = req.userId;

    let user = await User.findOne({ userId: userId });

    // If the user does not exist in our database...
    if (!user) {
      // create a new user document for them.
      console.log(`Creating new user profile for userId: ${userId}`);
      user = await User.create({
        userId: userId,
        // We can set default settings here if needed in the future !!!
        settings: {},
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in /api/me route:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;
