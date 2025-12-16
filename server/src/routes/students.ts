import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

/* =========================================================
   IN-MEMORY STORAGE (NO DATABASE)
   ========================================================= */

// Student sections (acts like a fake DB)
let studentSections = [
  {
    id: "1",
    title: "Academic Excellence",
    description: "Our students consistently perform well in academics.",
    image: "",
    created_at: new Date(),
  },
  {
    id: "2",
    title: "Sports & Activities",
    description: "We encourage physical fitness and extracurriculars.",
    image: "",
    created_at: new Date(),
  },
];

// Global student stats (single source of truth)
let studentStats = {
  total_students: 1200,
  total_classes: 40,
  achievements: 100,
  activities: 30,
};

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
router.get("/sections", (_req, res) => {
  res.json(studentSections);
});

// CREATE section (SUPER_ADMIN)
router.post("/sections", requireSuperAdmin, (req, res) => {
  const { title, description, image } = req.body;

  const newSection = {
    id: Date.now().toString(),
    title,
    description,
    image,
    created_at: new Date(),
  };

  studentSections.push(newSection);
  res.json(newSection);
});

// UPDATE section (SUPER_ADMIN)
router.put("/sections/:id", requireSuperAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description, image } = req.body;

  const index = studentSections.findIndex((s) => s.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Section not found" });
  }

  studentSections[index] = {
    ...studentSections[index],
    title,
    description,
    image,
  };

  res.json(studentSections[index]);
});

// DELETE section (SUPER_ADMIN)
router.delete("/sections/:id", requireSuperAdmin, (req, res) => {
  const { id } = req.params;
  studentSections = studentSections.filter((s) => s.id !== id);
  res.json({ success: true });
});

/* =========================================================
   STATS ROUTES
   ========================================================= */

// GET stats (PUBLIC)
router.get("/stats", (_req, res) => {
  res.json(studentStats);
});

// UPDATE stats (SUPER_ADMIN)
router.put("/stats", requireSuperAdmin, (req, res) => {
  const {
    total_students,
    total_classes,
    achievements,
    activities,
  } = req.body;

  studentStats = {
    total_students: Number(total_students),
    total_classes: Number(total_classes),
    achievements: Number(achievements),
    activities: Number(activities),
  };

  res.json(studentStats);
});

export default router;
