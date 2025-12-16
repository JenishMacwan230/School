import { Router } from "express";
import { pool } from "../db";
import jwt from "jsonwebtoken";

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
  const result = await pool.query(
    "SELECT * FROM alumni ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

/* ===== CREATE ===== */
router.post("/", requireSuperAdmin, async (req, res) => {
  const { name, batch, profession, achievement, image } = req.body;

  const result = await pool.query(
    `INSERT INTO alumni (name, batch, profession, achievement, image)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, batch, profession, achievement, image || "/user.jpg"]
  );

  res.json(result.rows[0]);
});

/* ===== UPDATE ===== */
router.put("/:id", requireSuperAdmin, async (req, res) => {
  const { name, batch, profession, achievement, image } = req.body;

  await pool.query(
    `UPDATE alumni
     SET name=$1, batch=$2, profession=$3, achievement=$4, image=$5
     WHERE id=$6`,
    [name, batch, profession, achievement, image, req.params.id]
  );

  res.json({ success: true });
});

/* ===== DELETE ===== */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  await pool.query("DELETE FROM alumni WHERE id=$1", [req.params.id]);
  res.json({ success: true });
});

export default router;
