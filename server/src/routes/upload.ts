import { Router } from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary";
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

/* ================= STORAGE FACTORY ================= */

const createStorage = (folder: string) =>
  new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder,
      allowed_formats: ["jpg", "png", "jpeg", "webp","avif"],
    }),
  });

/* ================= MULTER INSTANCES ================= */

const uploadTeacher = multer({
  storage: createStorage("teachers"),
});

const uploadStudent = multer({
  storage: createStorage("students"),
});

const uploadTrustee = multer({
  storage: createStorage("trustees"),
});

const uploadCampus = multer({
  storage: createStorage("campus"),
});

const uploadSports = multer({
  storage: createStorage("sports"),
});
/* =====================================================
   ROUTES
   ===================================================== */

/**
 * POST /api/upload/teacher-photo
 */
router.post(
  "/teacher-photo",
  requireSuperAdmin,
  uploadTeacher.single("image"),
  (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      type: "teacher",
    });
  }
);

/**
 * POST /api/upload/student-image
 */
router.post(
  "/student-image",
  requireSuperAdmin,
  uploadStudent.single("image"),
  (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
      type: "student",
    });
  }
);

/**
 * POST /api/upload/trustee-photo
 */
router.post(
  "/trustee-photo",
  requireSuperAdmin,
  uploadTrustee.single("image"),
  (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path,
      public_id: req.file.filename,
    });
  }
);
/**
 * POST /api/upload/campus-image
 */
router.post(
  "/campus-image",
  requireSuperAdmin,
  uploadCampus.single("image"),
  (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path,        // Cloudinary URL
      public_id: req.file.filename,
      type: "campus",
    });
  }
);

/**
 * POST /api/upload/sports-image
 */
router.post(
  "/sports-image",
  requireSuperAdmin,
  uploadSports.single("image"),
  (req: any, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    res.json({
      url: req.file.path,        // Cloudinary URL
      public_id: req.file.filename,
      type: "sports",
    });
  }
);


export default router;
