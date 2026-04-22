import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Alumni } from "../models";

const router = Router();

/* ===== SUPER ADMIN GUARD ===== */
function requireSuperAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (decoded.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

/* ===== GET (PUBLIC) ===== */
router.get("/", async (_req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });
    res.json(alumni);
  } catch (error) {
    console.error("FETCH ALUMNI ERROR", error);
    res.status(500).json({ message: "Failed to fetch alumni" });
  }
});

/* ===== CREATE ===== */
router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { name, batch, profession, achievement, image } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    const alumni = await Alumni.create({
      name,
      batch,
      profession,
      achievement,
      image: image || "/user.jpg",
    });

    res.json(alumni.toJSON());
  } catch (error) {
    console.error("CREATE ALUMNI ERROR", error);
    res.status(500).json({ message: "Failed to create alumni" });
  }
});

/* ===== UPDATE ===== */
router.put("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, batch, profession, achievement, image } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid alumni id" });
    }

    const updated = await Alumni.findByIdAndUpdate(
      id,
      { name, batch, profession, achievement, image },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE ALUMNI ERROR", error);
    res.status(500).json({ message: "Failed to update alumni" });
  }
});

/* ===== DELETE ===== */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid alumni id" });
    }

    const deleted = await Alumni.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    res.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE ALUMNI ERROR", error);
    res.status(500).json({ message: "Failed to delete alumni" });
  }
});

export default router;
