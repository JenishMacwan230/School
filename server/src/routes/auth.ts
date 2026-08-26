import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

/**
 * POST /auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || (!adminPassword && !adminPasswordHash)) {
      return res.status(500).json({
        message: "Server admin credentials are not configured",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (normalizedEmail !== adminEmail.trim().toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const normalizedPassword = String(password).trim();

    let isMatch = false;
    if (adminPassword) {
      isMatch = normalizedPassword === adminPassword;
    } else if (adminPasswordHash) {
      isMatch = await bcrypt.compare(normalizedPassword, adminPasswordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: "admin", email: adminEmail, role: "SUPER_ADMIN" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // ✅ COOKIE (for browser + legacy)
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // ✅ ALSO RETURN TOKEN (for Bearer auth)
    res.json({
      token,
      user: {
        id: "admin",
        email: adminEmail,
        role: "SUPER_ADMIN",
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /auth/me
 * ✅ Supports BOTH cookie + Bearer token
 */
router.get("/me", (req, res) => {
  let token: string | undefined;

  // 1️⃣ Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2️⃣ Fallback to cookie
  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) {
    return res.json({ user: null });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string; email?: string; role: string };

    res.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
    });
  } catch {
    res.json({ user: null });
  }
});

/**
 * POST /auth/logout
 */
router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.json({ message: "Logged out successfully" });
});

export default router;
