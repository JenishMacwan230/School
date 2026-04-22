import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { GalleryItem } from "../models";

const router = Router();

/* ===== SUPER ADMIN ===== */
function requireSuperAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    if (decoded.role !== "SUPER_ADMIN")
      return res.status(403).json({ message: "Forbidden" });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ===== GET ===== */
router.get("/", async (_req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("FETCH GALLERY ERROR", error);
    res.status(500).json({ message: "Failed to fetch gallery" });
  }
});

/* ===== CREATE ===== */
router.post("/", requireSuperAdmin, async (req, res) => {
  try {
    const { image } = req.body;

    if (!image?.trim()) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const item = await GalleryItem.create({ image });
    res.json(item.toJSON());
  } catch (error) {
    console.error("CREATE GALLERY ITEM ERROR", error);
    res.status(500).json({ message: "Failed to add gallery image" });
  }
});

/* ===== DELETE ===== */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid gallery id" });
    }

    const deleted = await GalleryItem.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE GALLERY ITEM ERROR", error);
    res.status(500).json({ message: "Failed to delete gallery item" });
  }
});

export default router;
