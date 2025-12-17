import { Router } from "express";
import { pool } from "../db";
import cloudinary from "../lib/cloudinary";
import {
  authenticateToken,
  requireSuperAdmin,
} from "../middleware/authMiddleware";

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
      const result = await pool.query(
        `
        INSERT INTO teachers (
          name, subject, role, "class", stream,
          experience, qualification, bio,
          photo, photo_public_id, email, phone
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        RETURNING *
        `,
        [
          name,
          subject,
          role,
          schoolClass,
          stream || null,
          experience || null,
          qualification || null,
          bio || null,
          photo || null,
          photo_public_id || null,
          email,
          phone || null,
        ]
      );

      res.status(201).json(result.rows[0]);
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
    const result = await pool.query(
      `SELECT * FROM teachers ORDER BY name ASC`
    );
    res.json(result.rows);
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
      // 1️⃣ Get old image
      const old = await pool.query(
        `SELECT photo_public_id FROM teachers WHERE id = $1`,
        [id]
      );

      const oldPublicId = old.rows[0]?.photo_public_id;

      // 2️⃣ Delete old Cloudinary image if changed
      if (oldPublicId && oldPublicId !== photo_public_id) {
        await cloudinary.uploader.destroy(oldPublicId);
      }

      // 3️⃣ Update DB
      const result = await pool.query(
        `
        UPDATE teachers SET
          name = $1,
          subject = $2,
          role = $3,
          "class" = $4,
          stream = $5,
          experience = $6,
          qualification = $7,
          bio = $8,
          photo = $9,
          photo_public_id = $10,
          email = $11,
          phone = $12
        WHERE id = $13
        RETURNING *
        `,
        [
          name,
          subject,
          role,
          schoolClass,
          stream || null,
          experience || null,
          qualification || null,
          bio || null,
          photo || null,
          photo_public_id || null,
          email,
          phone || null,
          id,
        ]
      );

      res.json(result.rows[0]);
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

    try {
      const result = await pool.query(
        `SELECT photo_public_id FROM teachers WHERE id = $1`,
        [id]
      );

      const publicId = result.rows[0]?.photo_public_id;

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      await pool.query(`DELETE FROM teachers WHERE id = $1`, [id]);

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
