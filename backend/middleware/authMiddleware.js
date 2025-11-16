import { Clerk } from "@clerk/clerk-sdk-node";

export const protect = async (req, res, next) => {
  // --- CREATE THE CLERK INSTANCE INSIDE THE FUNCTION ---
  const clerk = new Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

  try {
    // the frontend will send the token in authorization header like Bearer <token>
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const payload = await clerk.verifyToken(token); // clerk's server verifies if the token is valid, and returns the user's unique clerk id in the sub
    req.userId = payload.sub;
    next();
  } catch (error) {
    console.error("Authentication Error: ", error.message);
    res
      .status(401)
      .json({ success: false, error: "Not authorized, token failed" });
  }
};
