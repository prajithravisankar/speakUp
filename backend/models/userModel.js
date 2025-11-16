import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    // !!! TODO: We can add more fields here later, like name or email,
    // which we can get from Clerk. For now, userId is enough.

    // store user preferences later.
    settings: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
