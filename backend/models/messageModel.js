import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    characterId: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      index: true, // We add an index to this field for faster querying of chat histories.
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant", "model"],
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
