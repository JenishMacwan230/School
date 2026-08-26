/* ================= GLOBAL ERROR HANDLERS ================= */
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("💥 UNHANDLED REJECTION:", reason);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import { connectDB } from "./db";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import otpRoutes from "./routes/otp";
import adminPasswordRoutes from "./routes/adminPassword";
import testDbRoute from "./routes/test-db";
import teachersRoutes from "./routes/teachers";
import uploadRoutes from "./routes/upload";
import studentsRoutes from "./routes/students";
import aboutRoutes from "./routes/about";
import campusRouter from "./routes/campus";
import alumniRoutes from "./routes/alumni";
import sportsRoutes from "./routes/sports";
import galleryRoutes from "./routes/gallery";
import { requireDbConnection } from "./middleware/dbReady";

console.log("✅ All modules imported successfully");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://rnnaikshighschool.vercel.app",
].filter(Boolean) as string[];

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser and same-origin requests.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);




// console.log("AUTH ROUTES LOADED");


app.use("/api/test-db", testDbRoute);

app.use(express.json());
app.use(cookieParser()); // 🔥 REQUIRED

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminPasswordRoutes);
app.use("/api/otp", requireDbConnection, otpRoutes);
app.use("/api/about", requireDbConnection, aboutRoutes);
app.use("/api/teachers", requireDbConnection, teachersRoutes);
app.use("/api/students", requireDbConnection, studentsRoutes);
app.use("/api/campus", requireDbConnection, campusRouter);
app.use("/api/alumni", requireDbConnection, alumniRoutes);
app.use("/api/sports", requireDbConnection, sportsRoutes);
app.use("/api/gallery", requireDbConnection, galleryRoutes);
app.use("/api/upload", uploadRoutes);


// ✅ Health check route (ADD THIS)
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "school-backend",
    uptime: process.uptime(),
    time: new Date().toISOString(),
  });
});

/* ================= START SERVER ================= */
console.log(`✅ Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

connectDB().catch((error) => {
  console.error(
    "MongoDB connection failed. API is running, but database-backed endpoints may return errors until DB reconnects.",
    error
  );
});
