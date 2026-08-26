import { Router } from "express";
import { authenticateToken, requireSuperAdmin } from "../middleware/authMiddleware";

const router = Router();

/**
 * POST /admin/change-password
 * body: { newPassword }
 * OTP must be verified BEFORE calling this
 */
router.post(
  "/change-password",
  authenticateToken,
  requireSuperAdmin,
  async (_req, res) => {
    try {
      res.status(400).json({
        message:
          "Single-admin mode is enabled. Update ADMIN_PASSWORD_HASH in server/.env to change password.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
