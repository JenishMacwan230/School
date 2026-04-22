import { Router } from "express";
import { authenticateToken, requireSuperAdmin } from "../middleware/authMiddleware";
import { Otp } from "../models";

const router = Router();

/**
 * POST /otp/request
 * body: { purpose }
 */
router.post(
  "/request",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { purpose } = req.body;
      const user = (req as any).user;

      if (!purpose) {
        return res.status(400).json({ message: "Purpose is required" });
      }

      // generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.create({
        email: user.email ?? "admin",
        otp_code: otp,
        purpose,
        expires_at: new Date(Date.now() + 5 * 60 * 1000),
      });

      // TEMP: log OTP instead of emailing
      console.log("OTP GENERATED:", otp);

      res.json({ message: "OTP generated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * POST /otp/verify
 * body: { otp, purpose }
 */
router.post(
  "/verify",
  authenticateToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
      const { otp, purpose } = req.body;
      const user = (req as any).user;

      if (!otp || !purpose) {
        return res.status(400).json({ message: "OTP and purpose required" });
      }

      const existing = await Otp.findOne({
        otp_code: otp,
        purpose,
        used: false,
        expires_at: { $gt: new Date() },
      });

      if (!existing) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await Otp.findByIdAndUpdate(existing.id, { used: true });

      res.json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
