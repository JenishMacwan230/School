import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db";

const router = Router();

/**
 * POST /auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const result = await pool.query(
      "SELECT id, email, password_hash, role FROM users WHERE email = $1 AND is_active = true",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // 🔑 SET COOKIE (THIS IS THE KEY CHANGE)
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/me", (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: number; role: string };

    res.json({
      user: {
        id: decoded.userId,
        role: decoded.role,
      },
    });
  } catch {
    res.json({ user: null });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in production (https)
  });

  res.json({ message: "Logged out successfully" });
});



export default router;
