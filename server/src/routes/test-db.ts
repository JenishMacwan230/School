import { Router } from "express";
import { mongoose } from "../db";
import { User } from "../models";

const router = Router();

router.get("/db-test", async (_req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const users = await User.countDocuments();
    res.json({
      db: isConnected ? "connected" : "disconnected",
      users,
    });
  } catch (error) {
    console.error("DB TEST ERROR", error);
    res.status(500).json({ message: "Database test failed" });
  }
});

export default router;
