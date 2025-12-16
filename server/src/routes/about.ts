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

/* ================= IN-MEMORY DATA ================= */

// About Trust
let trustInfo = {
  title: "About the Managing Trust",
  description1:
    "R. N. Naik Sarvajanik High School is managed by Katha Vibhag Kelavani Mandal, Sarikhurad, a private aided educational trust dedicated to strengthening education in rural communities of the Gandevi Taluka, Navsari district.",
  description2:
    "The trust focuses on providing accessible and quality education at the secondary and higher secondary levels by maintaining academic discipline, supporting qualified teaching staff, and developing essential educational infrastructure.",
  logo: "/trus.jpeg",
};

// Trustees


/* ================= ROUTES ================= */

// PUBLIC
router.get("/trust", (_req, res) => {
  res.json(trustInfo);
});

router.get("/trustees", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM trustees ORDER BY position ASC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch trustees" });
  }
});


// ADMIN
router.put("/trust", requireSuperAdmin, (req, res) => {
  const { title, description1, description2, logo } = req.body;

  trustInfo = {
    title,
    description1,
    description2,
    logo,
  };

  res.json(trustInfo);
});



router.post("/trustees", requireSuperAdmin, async (req, res) => {
  const { name, role, image, position } = req.body;

 if (!name?.trim() || !role?.trim()) {
  return res.status(400).json({
    message: "Name and role are required",
  });
}

// image is OPTIONAL
const finalImage = image || "/user.jpg";


  const result = await pool.query(
    `
    INSERT INTO trustees (name, role, image, position)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [name, role, image, position ?? 0]
  );

  res.json(result.rows[0]);
});

router.put("/trustees/:id", requireSuperAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, role, image, position } = req.body;

  const result = await pool.query(
    `
    UPDATE trustees
    SET name = $1, role = $2, image = $3, position = $4
    WHERE id = $5
    RETURNING *
    `,
    [name, role, image, position, id]
  );

  res.json(result.rows[0]);
});

router.delete("/trustees/:id", requireSuperAdmin, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const result = await pool.query(
      "DELETE FROM trustees WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Trustee not found",
      });
    }

    res.json({
      success: true,
      deleted: result.rows[0],
    });
  } catch (err) {
    console.error("Delete trustee error:", err);
    res.status(500).json({
      message: "Failed to delete trustee",
    });
  }
});


export default router;
