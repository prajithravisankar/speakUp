import { Router } from "express";
// Import our Character model
import Character from "../models/characterModel.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const characters = await Character.find({});

    res.json({
      success: true,
      data: characters,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const character = await Character.findOne({ characterId: id });

    if (character) {
      res.json({
        success: true,
        data: character,
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Character not found",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

export default router;
