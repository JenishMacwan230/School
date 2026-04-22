import { Router } from "express";
import bcrypt from "bcryptjs";
import { authenticateToken, requireSuperAdmin } from "../middleware/authMiddleware";
import { User } from "../models";

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
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      const user = (req as any).user;

      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updated = await User.findByIdAndUpdate(
        user.userId,
        { password_hash: hashedPassword },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "Password updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
