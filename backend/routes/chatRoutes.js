import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Character from "../models/characterModel.js";
import { GoogleGenAI } from "@google/genai"; // <-- Correct import

const router = Router();

// ============================================================
// GET: Chat history
// ============================================================
router.get("/:characterId/history", protect, async (req, res) => {
  // ... (Your GET route code is fine, no changes needed)
  try {
    const clerkUserId = req.userId;
    const { sessionId } = req.query;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, error: "Session ID is required" });
    }

    const user = await User.findOne({ userId: clerkUserId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const messages = await Message.find({
      userId: user._id,
      sessionId: sessionId,
    }).sort({ createdAt: "asc" });

    return res.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

// ============================================================
// POST: Send a message & receive AI response
// ============================================================
router.post("/:characterId/message", protect, async (req, res) => {
  try {
    // 1. Initialize the AI client (as shown in the docs)
    // This is correct now, it will load the key from process.env
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // 2. Get data from request
    const { characterId } = req.params;
    const { message, sessionId } = req.body;
    const clerkUserId = req.userId;

    // 3. Validate input
    if (!message || !sessionId) {
      return res
        .status(400)
        .json({ success: false, error: "Message and sessionId are required" });
    }

    // 4. Find user and character
    const user = await User.findOne({ userId: clerkUserId });
    const character = await Character.findOne({ characterId: characterId });

    if (!user || !character) {
      return res
        .status(404)
        .json({ success: false, error: "User or Character not found" });
    }

    // 5. Save the user's message
    await Message.create({
      userId: user._id,
      characterId: character.characterId,
      sessionId,
      role: "user",
      content: message,
    });

    // 6. Get chat history from *our* DB
    const history = await Message.find({ sessionId: sessionId })
      .sort({ createdAt: "asc" }) // Use ascending for correct chat order
      .limit(20); // Get recent history

    // 7. Format history for the Gemini API
    const chatHistoryForAI = history.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role, // Handle old data
      parts: [{ text: msg.content }],
    }));

    // 8. Create the chat session (using the correct method from your docs)
    const chat = ai.chats.create({
      model: "gemini-2.5-flash", // Use the model you want
      history: chatHistoryForAI,
      systemInstruction: `You are the character "${character.name}". Your role is: ${character.role}. Your personality is: ${character.vibe}. Respond as this character. Be concise.`,
    });

    // 9. Send the new message to Gemini
    const response = await chat.sendMessage({
      message: message,
    });

    const aiMessageText = response.text; // Get the text from the response

    // 10. Save AI response to DB
    const aiMessage = await Message.create({
      userId: user._id,
      characterId: character.characterId,
      sessionId,
      role: "model", // <-- Must be "model"
      content: aiMessageText,
    });

    // 11. Send response to client
    return res.status(201).json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("Error in chat message:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;
