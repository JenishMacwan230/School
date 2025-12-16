import { Router } from "express";
import { pool } from "../db";
import cloudinary from "../lib/cloudinary";
import jwt from "jsonwebtoken";

const router = Router();


/**
 * POST /api/teachers
 * Create new teacher (SUPER_ADMIN)
 */
router.post("/", requireSuperAdmin, async (req, res) => {
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
    const result = await pool.query(
      `
      INSERT INTO teachers (
        name, subject, role, class, stream,
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
        stream,
        experience,
        qualification,
        bio,
        photo,
        photo_public_id,
        email,
        phone,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create teacher" });
  }
});

/**
 * GET /api/teachers
 * Public – fetch all teachers
 */
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM teachers ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});


/* ================= AUTH ================= */
function requireSuperAdmin(req: any, res: any, next: any) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { role: string };

  if (decoded.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}

/* ================= UPDATE TEACHER ================= */
/**
 * PUT /api/teachers/:id
 */
router.put("/:id", requireSuperAdmin, async (req, res) => {
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
    // 1️⃣ Get old image public_id
    const old = await pool.query(
      "SELECT photo_public_id FROM teachers WHERE id = $1",
      [id]
    );

    const oldPublicId = old.rows[0]?.photo_public_id;

    // 2️⃣ Delete old image if replaced
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
        class = $4,
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
        stream,
        experience,
        qualification,
        bio,
        photo,
        photo_public_id,
        email,
        phone,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update teacher" });
  }
});



/**
 * DELETE /api/teachers/:id
 */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    // 1️⃣ Get image public_id
    const result = await pool.query(
      "SELECT photo_public_id FROM teachers WHERE id = $1",
      [id]
    );

    const publicId = result.rows[0]?.photo_public_id;

    // 2️⃣ Delete image from Cloudinary
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    // 3️⃣ Delete from DB
    await pool.query("DELETE FROM teachers WHERE id = $1", [id]);

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete teacher" });
  }
});


export default router;
