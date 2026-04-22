import { Router } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Trust, Trustee } from "../models";

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
  try {
    const trust = await Trust.findOne().sort({ updatedAt: -1 });
    res.json(trust || null);
  } catch (error) {
    console.error("FETCH TRUST ERROR", error);
    res.status(500).json({ message: "Failed to fetch trust" });
  }
});

// PUBLIC — TRUSTEES
router.get("/trustees", async (_req, res) => {
  try {
    const trustees = await Trustee.find().sort({ position: 1, createdAt: 1 });
    res.json(trustees);
  } catch (error) {
    console.error("FETCH TRUSTEES ERROR", error);
    res.status(500).json({ message: "Failed to fetch trustees" });
  }
});

// ADMIN — UPDATE TRUST (PROTECTED)
router.put("/trust", requireSuperAdmin, async (req, res) => {
  try {
    const { title, description1, description2, logo } = req.body;

    const updated = await Trust.findOneAndUpdate(
      {},
      { title, description1, description2, logo },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("UPDATE TRUST ERROR", error);
    res.status(500).json({ message: "Failed to update trust" });
  }
});

// ADMIN — ADD TRUSTEE
router.post("/trustees", requireSuperAdmin, async (req, res) => {
  try {
    const { name, role, image, position } = req.body;

    if (!name?.trim() || !role?.trim()) {
      return res.status(400).json({ message: "Name and role are required" });
    }

    const trustee = await Trustee.create({
      name,
      role,
      image: image || "/user.jpg",
      position: position ?? 0,
    });

    res.json(trustee.toJSON());
  } catch (error) {
    console.error("CREATE TRUSTEE ERROR", error);
    res.status(500).json({ message: "Failed to create trustee" });
  }
});

// ADMIN — UPDATE TRUSTEE
router.put("/trustees/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, image, position } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trustee id" });
    }

    const updated = await Trustee.findByIdAndUpdate(
      id,
      {
        name,
        role,
        image: image || "/user.jpg",
        position: position ?? 0,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Trustee not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("UPDATE TRUSTEE ERROR", error);
    res.status(500).json({ message: "Failed to update trustee" });
  }
});

// ADMIN — DELETE TRUSTEE
router.delete("/trustees/:id", requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid trustee id" });
    }

    const deleted = await Trustee.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Trustee not found" });
    }

    res.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE TRUSTEE ERROR", error);
    res.status(500).json({ message: "Failed to delete trustee" });
  }
});

export default router;
