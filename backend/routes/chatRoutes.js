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

    // 8. Count the number of back-and-forth exchanges
    const userMessageCount = history.filter(
      (msg) => msg.role === "user"
    ).length;
    const MAX_EXCHANGES = 10; // Practice session ends after 10 exchanges
    const isNearEnd = userMessageCount >= MAX_EXCHANGES - 2;
    const isEndOfConversation = userMessageCount >= MAX_EXCHANGES;

    // 9. Create the chat session with dynamic instructions
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: chatHistoryForAI,
      systemInstruction: `You are ${character.name}. ${character.role}. ${
        character.vibe
      }

STRICT RULES:
1. Respond in 1-2 SHORT sentences ONLY (like real texting)
2. NEVER write long paragraphs or lists
3. Stay in character at ALL times
4. Focus ONLY on your specific goal
${
  isNearEnd && !isEndOfConversation
    ? `5. You've had a good conversation. Start wrapping up naturally in 1-2 more exchanges.`
    : ""
}
${
  isEndOfConversation
    ? `5. IMPORTANT: This is the last exchange. Thank them warmly, summarize the conversation briefly in ONE sentence, and say goodbye. End with "Great practice session! 👋"`
    : ""
}

Example good response: "Hey! How's your week going so far?"
Example BAD response: Long paragraphs, numbered lists, generic advice.`,
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

// ============================================================
// POST: Start a new conversation (AI sends first message)
// ============================================================
router.post("/:characterId/start", protect, async (req, res) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const { characterId } = req.params;
    const { sessionId } = req.body;
    const clerkUserId = req.userId;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, error: "sessionId is required" });
    }

    const user = await User.findOne({ userId: clerkUserId });
    const character = await Character.findOne({ characterId: characterId });

    if (!user || !character) {
      return res
        .status(404)
        .json({ success: false, error: "User or Character not found" });
    }

    // Check if this session already has messages
    const existingMessages = await Message.countDocuments({ sessionId });
    if (existingMessages > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Session already started" });
    }

    // Generate the opening message
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      history: [],
      systemInstruction: `You are ${character.name}. ${character.role}. ${character.vibe}

CRITICAL: You are starting a conversation with someone. Greet them naturally as ${character.name} would.
Keep it to 1-2 short sentences. Be friendly and in character.`,
    });

    const response = await chat.sendMessage({
      message: "Start the conversation by greeting the user",
    });

    const aiMessageText = response.text;

    // Save the AI's opening message
    const aiMessage = await Message.create({
      userId: user._id,
      characterId: character.characterId,
      sessionId,
      role: "model",
      content: aiMessageText,
    });

    return res.status(201).json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("Error starting conversation:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;
