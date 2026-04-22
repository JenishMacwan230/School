import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { CampusSection } from "../models";

const router = Router();

const requireSuperAdmin = (req: any, res: any, next: any) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  if (decoded.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

/* PUBLIC */
router.get("/", async (_req, res) => {
  try {
    const sections = await CampusSection.find().sort({ position: 1, createdAt: 1 });
    res.json(sections);
  } catch (error) {
    console.error("FETCH CAMPUS SECTIONS ERROR", error);
    res.status(500).json({ message: "Failed to fetch campus sections" });
  }
});

/* ADMIN */
router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { title, description, image, position } = req.body;

    if (!title?.trim() || !description?.trim()) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const section = await CampusSection.create({
      title,
      description,
      image,
      position: position ?? 0,
    });

    res.json(section.toJSON());
  } catch (error) {
    console.error("CREATE CAMPUS SECTION ERROR", error);
    res.status(500).json({ message: "Failed to create campus section" });
  }
});

router.put("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, position } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const updated = await CampusSection.findByIdAndUpdate(
      id,
      { title, description, image, position },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE CAMPUS SECTION ERROR", error);
    res.status(500).json({ message: "Failed to update campus section" });
  }
});

router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const deleted = await CampusSection.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE CAMPUS SECTION ERROR", error);
    res.status(500).json({ message: "Failed to delete campus section" });
  }
});

export default router;
