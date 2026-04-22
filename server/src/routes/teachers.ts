import { Router } from "express";
import { Types } from "mongoose";
import cloudinary from "../lib/cloudinary";
import {
  authenticateToken,
  requireSuperAdmin,
} from "../middleware/authMiddleware";
import { Teacher } from "../models";

const router = Router();

/**
 * POST /api/teachers
 * Create teacher (SUPER_ADMIN only)
 */
router.post(
  "/",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    const {
      name,
      subject,
      role,
      class: schoolClass,
      stream,
      experience,
      qualification,
      bio,
      photo,
      photo_public_id,
      email,
      phone,
    } = req.body;

    // ✅ Required field validation
    if (!name || !subject || !role || !schoolClass || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const teacher = await Teacher.create({
        name,
        subject,
        role,
        class: schoolClass,
        stream: stream || null,
        experience: experience || null,
        qualification: qualification || null,
        bio: bio || null,
        photo: photo || null,
        photo_public_id: photo_public_id || null,
        email,
        phone: phone || null,
      });

      res.status(201).json(teacher.toJSON());
    } catch (err: any) {
      console.error("CREATE TEACHER ERROR:", err.message);
      res.status(500).json({
        message: "Failed to create teacher",
        error: err.message,
      });
    }
  }
);

/**
 * GET /api/teachers
 * Public route
 */
router.get("/", async (_req, res) => {
  try {
    const teachers = await Teacher.find().sort({ name: 1 });
    res.json(teachers);
  } catch (err: any) {
    console.error("FETCH TEACHERS ERROR:", err.message);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

/**
 * PUT /api/teachers/:id
 * Update teacher (SUPER_ADMIN only)
 */
router.put(
  "/:id",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher id" });
    }

    const {
      name,
      subject,
      role,
      class: schoolClass,
      stream,
      experience,
      qualification,
      bio,
      photo,
      photo_public_id,
      email,
      phone,
    } = req.body;

    try {
      const existing = await Teacher.findById(id);

      if (!existing) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      if (
        existing.photo_public_id &&
        existing.photo_public_id !== photo_public_id
      ) {
        await cloudinary.uploader.destroy(existing.photo_public_id);
      }

      existing.name = name;
      existing.subject = subject;
      existing.role = role;
      existing.class = schoolClass;
      existing.stream = stream || null;
      existing.experience = experience || null;
      existing.qualification = qualification || null;
      existing.bio = bio || null;
      existing.photo = photo || null;
      existing.photo_public_id = photo_public_id || null;
      existing.email = email;
      existing.phone = phone || null;

      const saved = await existing.save();

      res.json(saved.toJSON());
    } catch (err: any) {
      console.error("UPDATE TEACHER ERROR:", err.message);
      res.status(500).json({
        message: "Failed to update teacher",
        error: err.message,
      });
    }
  }
);

/**
 * DELETE /api/teachers/:id
 * Delete teacher (SUPER_ADMIN only)
 */
router.delete(
  "/:id",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid teacher id" });
    }

    try {
      const existing = await Teacher.findById(id);

      if (!existing) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      if (existing.photo_public_id) {
        await cloudinary.uploader.destroy(existing.photo_public_id);
      }

      await existing.deleteOne();

      res.json({ message: "Teacher deleted successfully" });
    } catch (err: any) {
      console.error("DELETE TEACHER ERROR:", err.message);
      res.status(500).json({
        message: "Failed to delete teacher",
        error: err.message,
      });
    }
  }
);

export default router;
