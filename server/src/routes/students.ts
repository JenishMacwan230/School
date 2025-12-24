import { Router } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db";

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
    const result = await pool.query(
      "SELECT id, title, description, image FROM student_sections ORDER BY id ASC"
    );
    res.json(result.rows);
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

    const result = await pool.query(
      `
      INSERT INTO student_sections (title, description, image)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [title, description, image || null]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("CREATE section error:", err);
    res.status(500).json({ message: "Failed to create section" });
  }
});

// UPDATE section (SUPER_ADMIN)
router.put("/sections/:id", requireSuperAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, image } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const result = await pool.query(
      `
      UPDATE student_sections
      SET title = $1,
          description = $2,
          image = $3
      WHERE id = $4
      RETURNING *
      `,
      [title, description, image || null, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE section error:", err);
    res.status(500).json({ message: "Failed to update section" });
  }
});

// DELETE section (SUPER_ADMIN)
router.delete("/sections/:id", requireSuperAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid section id" });
    }

    const result = await pool.query(
      "DELETE FROM student_sections WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ success: true, deleted: result.rows[0] });
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
    const result = await pool.query(
      `
      SELECT total_students, total_classes, achievements, activities
      FROM student_stats
      WHERE id = 1
      `
    );

    res.json(result.rows[0]);
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

    const result = await pool.query(
      `
      UPDATE student_stats
      SET total_students = $1,
          total_classes = $2,
          achievements = $3,
          activities = $4
      WHERE id = 1
      RETURNING *
      `,
      [
        Number(total_students),
        Number(total_classes),
        Number(achievements),
        Number(activities),
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("UPDATE stats error:", err);
    res.status(500).json({ message: "Failed to update stats" });
  }
});

export default router;
