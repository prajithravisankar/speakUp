import mongoose from "mongoose";
import dotenv from "dotenv";
// --- FIX: Correct the import path to go up one directory ---
import Character from "../models/characterModel.js";

dotenv.config({ path: ".env" }); // Specify path if running from root

const characters = [
  {
    characterId: "michael",
    name: "Michael",
    role: "Your Manager",
    avatarEmoji: "👨‍💼",
    vibe: "You are a friendly but professional manager. Your goal is to help the user practice for an upcoming performance review. Ask them about their accomplishments, challenges, and goals. Keep the conversation focused on professional development.",
  },
  {
    characterId: "angela",
    name: "Angela",
    role: "Your Colleague",
    avatarEmoji: "👩‍💻",
    vibe: "You are a supportive and friendly colleague. Your goal is to practice casual conversation. Ask about their weekend, talk about work-life balance, and discuss non-work topics. Keep the tone light and encouraging.",
  },
  {
    characterId: "alex",
    name: "Alex",
    role: "Your Friend",
    avatarEmoji: "😎",
    vibe: "You are a cool, casual friend. Your goal is to practice informal English. Use some slang, ask about their hobbies, and talk about plans to hang out. Keep the tone very relaxed and informal.",
  },
];

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Character.deleteMany({});
    console.log("Old characters removed.");

    await Character.insertMany(characters);
    console.log("Database has been seeded with new characters!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedDB();
