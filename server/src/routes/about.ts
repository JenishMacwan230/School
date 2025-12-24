import { Router } from "express";
import { pool } from "../db";
import jwt from "jsonwebtoken";

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

/* ================= ROUTES ================= */

// PUBLIC — TRUST
router.get("/trust", async (_req, res) => {
  const result = await pool.query(
    "SELECT id, title, description1, description2, logo FROM trust LIMIT 1"
  );
  res.json(result.rows[0]);
});

// PUBLIC — TRUSTEES
router.get("/trustees", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trustees ORDER BY position ASC"
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch trustees" });
  }
});

// ADMIN — UPDATE TRUST (PROTECTED)
router.put("/trust", requireSuperAdmin, async (req, res) => {
  const { title, description1, description2, logo } = req.body;

  const result = await pool.query(
    `UPDATE trust
     SET title=$1, description1=$2, description2=$3, logo=$4
     WHERE id = 1
     RETURNING *`,
    [title, description1, description2, logo]
  );

  res.json(result.rows[0]);
});

// ADMIN — ADD TRUSTEE
router.post("/trustees", requireSuperAdmin, async (req, res) => {
  const { name, role, image, position } = req.body;

  if (!name?.trim() || !role?.trim()) {
    return res.status(400).json({ message: "Name and role are required" });
  }

  const finalImage = image || "/user.jpg";

  const result = await pool.query(
    `
    INSERT INTO trustees (name, role, image, position)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, role, finalImage, position ?? 0]
  );

  res.json(result.rows[0]);
});

// ADMIN — UPDATE TRUSTEE
router.put("/trustees/:id", requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, role, image, position } = req.body;

  const result = await pool.query(
    `
    UPDATE trustees
    SET name=$1, role=$2, image=$3, position=$4
    WHERE id=$5
    RETURNING *
    `,
    [name, role, image || "/user.jpg", position ?? 0, id]
  );

  res.json(result.rows[0]);
});

// ADMIN — DELETE TRUSTEE
router.delete("/trustees/:id", requireSuperAdmin, async (req, res) => {
  const id = Number(req.params.id);

  const result = await pool.query(
    "DELETE FROM trustees WHERE id=$1 RETURNING *",
    [id]
  );

  if (!result.rowCount) {
    return res.status(404).json({ message: "Trustee not found" });
  }

  res.json({ success: true, deleted: result.rows[0] });
});

export default router;
