import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // ✅ attach user safely
    (req as any).user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user as JwtPayload | undefined;

  // ✅ SAFETY CHECK
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }

  next();
};
