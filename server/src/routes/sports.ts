import { Router } from "express";
import jwt from "jsonwebtoken";
import {pool} from "../db"; // adjust path if needed

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
    const { rows } = await pool.query(
      "SELECT * FROM sports ORDER BY position ASC, id DESC"
    );
    res.json(rows); // ✅ MUST RETURN JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch sports" });
  }
});

/* ================= CREATE ================= */
router.post("/", requireSuperAdmin, async (req, res) => {
  const { title, category, description, image, position } = req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "Title & category required" });
  }

  const { rows } = await pool.query(
    `INSERT INTO sports (title, category, description, image, position)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [title, category, description || "", image, position || 0]
  );

  res.json(rows[0]);
});

/* ================= UPDATE ================= */
router.put("/:id", requireSuperAdmin, async (req, res) => {
  const { title, category, description, image, position } = req.body;

  await pool.query(
    `UPDATE sports
     SET title=$1, category=$2, description=$3, image=$4, position=$5
     WHERE id=$6`,
    [title, category, description, image, position, req.params.id]
  );

  res.json({ success: true });
});

/* ================= DELETE ================= */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  await pool.query("DELETE FROM sports WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
