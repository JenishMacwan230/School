import { Router } from "express";
import {pool} from "../db";
import jwt from "jsonwebtoken";

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
  const { rows } = await pool.query(
    "SELECT * FROM campus_sections ORDER BY position ASC"
  );
  res.json(rows);
});

/* ADMIN */
router.post("/", requireSuperAdmin, async (req, res) => {
  const { title, description, image, position } = req.body;

  const { rows } = await pool.query(
    `INSERT INTO campus_sections (title, description, image, position)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [title, description, image, position]
  );

  res.json(rows[0]);
});

router.put("/:id", requireSuperAdmin, async (req, res) => {
  const { title, description, image, position } = req.body;

  await pool.query(
    `UPDATE campus_sections
     SET title=$1, description=$2, image=$3, position=$4
     WHERE id=$5`,
    [title, description, image, position, req.params.id]
  );

  res.json({ success: true });
});

router.delete("/:id", requireSuperAdmin, async (req, res) => {
  await pool.query("DELETE FROM campus_sections WHERE id=$1", [
    req.params.id,
  ]);
  res.json({ success: true });
});

export default router;
