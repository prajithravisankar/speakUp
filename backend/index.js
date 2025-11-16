import express from "express";
import dotenv from "dotenv";
// Make sure to call config() at the top
dotenv.config();

import connectDB from "./config/db.js";
import characterRoutes from "./routes/characters.js";

// --- Connect to the database ---
await connectDB();

const app = express();

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("SpeakUp Backend is running!");
});

app.use("/api/characters", characterRoutes);

app.listen(PORT, () => {
  // Now the server only starts listening after the DB is connected.
  console.log(`Server is listening on PORT: ${PORT}`);
});
