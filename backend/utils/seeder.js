import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Character from "../models/characterModel.js";

dotenv.config();

// basic hardcoded characters
const characters = [
  {
    characterId: "michael",
    name: "Michael",
    role: "Your Manager",
    avatarEmoji: "👨‍💼",
    vibe: "A friendly but professional manager who wants to help you practice for your performance review.",
  },
  {
    characterId: "angela",
    name: "Angela",
    role: "Your Colleague",
    avatarEmoji: "👩‍💻",
    vibe: "A supportive colleague who is great for practicing casual conversations and discussing team projects.",
  },
  {
    characterId: "alex",
    name: "Alex",
    role: "Your Friend",
    avatarEmoji: "😎",
    vibe: "A cool and casual friend. Perfect for practicing informal English and everyday chat.",
  },
];

// running node utils/seeder.js will run this function
const importData = async () => {
  try {
    await connectDB();
    await Character.deleteMany();
    await Character.insertMany(characters);

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// This function will destroy all character data in the database. the command: node utils/seeder.js -d
const destroyData = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear all characters
    await Character.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
