import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { mongoose } from "../db";
import { StudentSection, StudentStat } from "../models";

const router = Router();

/* =========================================================
   SUPER ADMIN GUARD
   ========================================================= */

function requireSuperAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

/* =========================================================
   STUDENT SECTIONS (DATABASE)
   ========================================================= */

// GET all sections (PUBLIC)
router.get("/sections", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json([]);
    }

    const sections = await StudentSection.find().sort({ createdAt: 1 });
    res.json(sections);
  } catch (err) {
    console.error("GET sections error:", err);
    res.status(500).json({ message: "Failed to fetch sections" });
  }
});

// CREATE section (SUPER_ADMIN)
router.post("/sections", requireSuperAdmin, async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const section = await StudentSection.create({
      title,
      description,
      image: image || null,
    });

    res.json(section.toJSON());
  } catch (err) {
    console.error("CREATE section error:", err);
    res.status(500).json({ message: "Failed to create section" });
  }
});

// UPDATE section (SUPER_ADMIN)
router.put("/sections/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const updated = await StudentSection.findByIdAndUpdate(
      id,
      { title, description, image: image || null },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE section error:", err);
    res.status(500).json({ message: "Failed to update section" });
  }
});

// DELETE section (SUPER_ADMIN)
router.delete("/sections/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const deleted = await StudentSection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ success: true, deleted });
  } catch (err) {
    console.error("DELETE section error:", err);
    res.status(500).json({ message: "Failed to delete section" });
  }
});

/* =========================================================
   STUDENT STATS (DATABASE – SINGLE ROW)
   ========================================================= */

// GET stats (PUBLIC)
router.get("/stats", async (_req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        total_students: 0,
        total_classes: 0,
        achievements: 0,
        activities: 0,
      });
    }

    const stats = await StudentStat.findOne();
    res.json(stats || null);
  } catch (err) {
    console.error("GET stats error:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

// UPDATE stats (SUPER_ADMIN)
router.put("/stats", requireSuperAdmin, async (req, res) => {
  try {
    const {
      total_students,
      total_classes,
      achievements,
      activities,
    } = req.body;

    const updated = await StudentStat.findOneAndUpdate(
      {},
      {
        total_students: Number(total_students) || 0,
        total_classes: Number(total_classes) || 0,
        achievements: Number(achievements) || 0,
        activities: Number(activities) || 0,
      },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE stats error:", err);
    res.status(500).json({ message: "Failed to update stats" });
  }
});

export default router;
