import { Router } from "express";
import { authenticateToken, requireSuperAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * GET /admin/me
 * Protected route
 */
router.get(
  "/me",
  authenticateToken,
  requireSuperAdmin,
  (req, res) => {
    res.json({
      message: "You are a SUPER_ADMIN",
      user: (req as any).user,
    });
  }
);

export default router;
