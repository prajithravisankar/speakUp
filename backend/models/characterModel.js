import mongoose from "mongoose";

// Define the schema for the Character collection
const characterSchema = new mongoose.Schema(
  {
    characterId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    avatarEmoji: {
      type: String,
      required: true,
    },
    vibe: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Character = mongoose.model("Character", characterSchema);

export default Character;
