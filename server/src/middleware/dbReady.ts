import { Request, Response, NextFunction } from "express";
import { mongoose } from "../db";

export function requireDbConnection(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        "Database unavailable. Verify MongoDB Atlas credentials and network access.",
    });
  }

  next();
}
