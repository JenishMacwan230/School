import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";

const router = Router();

/* =========================================================
   SUPER ADMIN GUARD
   ========================================================= */

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

/* =========================================================
   SECTIONS ROUTES
   ========================================================= */

// GET all sections (PUBLIC)
router.get("/sections", async (_req, res) => {
  const result = await pool.query(
    "SELECT id, title, description, image FROM student_sections ORDER BY id ASC"
  );
  res.json(result.rows);
});


// CREATE section (SUPER_ADMIN)
router.post("/sections", requireSuperAdmin, async (req, res) => {
  const { title, description, image } = req.body;

  const result = await pool.query(
    `
    INSERT INTO student_sections (title, description, image)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [title, description, image || null]
  );

  res.json(result.rows[0]);
});

// UPDATE section (SUPER_ADMIN)
router.put("/sections/:id", requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;

  const result = await pool.query(
    `
    UPDATE student_sections
    SET title=$1, description=$2, image=$3
    WHERE id=$4
    RETURNING *
    `,
    [title, description, image || null, id]
  );

  res.json(result.rows[0]);
});

// DELETE section (SUPER_ADMIN)
router.delete("/sections/:id", requireSuperAdmin, async (req, res) => {
  await pool.query(
    "DELETE FROM student_sections WHERE id=$1",
    [req.params.id]
  );
  res.json({ success: true });
});

/* =========================================================
   STATS ROUTES
   ========================================================= */

// GET stats (PUBLIC)
router.get("/stats", async (_req, res) => {
  const result = await pool.query(
    "SELECT total_students, total_classes, achievements, activities FROM student_stats WHERE id=1"
  );
  res.json(result.rows[0]);
});


// UPDATE stats (SUPER_ADMIN)
router.put("/stats", requireSuperAdmin, async (req, res) => {
  const {
    total_students,
    total_classes,
    achievements,
    activities,
  } = req.body;

  const result = await pool.query(
    `
    UPDATE student_stats
    SET total_students=$1,
        total_classes=$2,
        achievements=$3,
        activities=$4
    WHERE id=1
    RETURNING *
    `,
    [
      total_students,
      total_classes,
      achievements,
      activities,
    ]
  );

  res.json(result.rows[0]);
});


export default router;
