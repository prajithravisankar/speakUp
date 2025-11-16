import express from "express";
import dotenv from "dotenv";
// Make sure to call config() at the top
dotenv.config();

import cors from "cors";

import connectDB from "./config/db.js";
import characterRoutes from "./routes/characters.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// --- Connect to the database ---
await connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from your frontend origin
  })
);

app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("SpeakUp Backend is running!");
});

app.use("/api/characters", characterRoutes);
app.use("/api/me", userRoutes); // Any request to '/api/me' will be handled by our user router, which is protected by the middleware.
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  // Now the server only starts listening after the DB is connected.
  console.log(`Server is listening on PORT: ${PORT}`);
});
