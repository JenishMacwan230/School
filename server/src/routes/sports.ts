import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Sport } from "../models";

const router = Router();

/* ================= SUPER ADMIN GUARD ================= */

function requireSuperAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { role: string };

    if (decoded.role !== "SUPER_ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= GET (PUBLIC) ================= */
// ✅ THIS WAS MISSING
router.get("/", async (_req, res) => {
  try {
    const sports = await Sport.find().sort({ position: 1, createdAt: -1 });
    res.json(sports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sports" });
  }
});

/* ================= CREATE ================= */
router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { title, category, description, image, position } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title & category required" });
    }

    const sport = await Sport.create({
      title,
      category,
      description: description || "",
      image,
      position: position ?? 0,
    });

    res.json(sport.toJSON());
  } catch (error) {
    console.error("CREATE SPORT ERROR", error);
    res.status(500).json({ message: "Failed to create sport" });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, description, image, position } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sport id" });
    }

    const updated = await Sport.findByIdAndUpdate(
      id,
      { title, category, description, image, position },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Sport not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE SPORT ERROR", error);
    res.status(500).json({ message: "Failed to update sport" });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid sport id" });
    }

    const deleted = await Sport.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Sport not found" });
    }

    res.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE SPORT ERROR", error);
    res.status(500).json({ message: "Failed to delete sport" });
  }
});

export default router;
