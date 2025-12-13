import { Router } from "express";
import { pool } from "../db";
import { authenticateToken, requireSuperAdmin } from "../middleware/authMiddleware";

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

      await pool.query(
        `INSERT INTO otps (email, otp_code, purpose, expires_at)
         VALUES ($1, $2, $3, NOW() + INTERVAL '5 minutes')`,
        [user.email ?? "admin", otp, purpose]
      );

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

      const result = await pool.query(
        `SELECT id FROM otps
         WHERE otp_code = $1
           AND purpose = $2
           AND used = false
           AND expires_at > NOW()`,
        [otp, purpose]
      );

      if (result.rowCount === 0) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await pool.query(
        `UPDATE otps SET used = true WHERE id = $1`,
        [result.rows[0].id]
      );

      res.json({ message: "OTP verified successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
