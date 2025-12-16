import { Router } from "express";
import {pool} from "../db";
import jwt from "jsonwebtoken";

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
router.get("/", async (_, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM gallery ORDER BY id DESC"
  );
  res.json(rows);
});

/* ===== CREATE ===== */
router.post("/", requireSuperAdmin, async (req, res) => {
  const { image } = req.body;
  const { rows } = await pool.query(
    "INSERT INTO gallery (image) VALUES ($1) RETURNING *",
    [image]
  );
  res.json(rows[0]);
});

/* ===== DELETE ===== */
router.delete("/:id", requireSuperAdmin, async (req, res) => {
  await pool.query("DELETE FROM gallery WHERE id = $1", [req.params.id]);
  res.json({ success: true });
});

export default router;
