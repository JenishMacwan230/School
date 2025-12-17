import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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



dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: true,        // 🔥 allow current request origin
    credentials: true,   // 🔥 allow cookies
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
app.use("/api/otp", otpRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/campus", campusRouter);
app.use("/api/alumni", alumniRoutes);
app.use("/api/sports", sportsRoutes);
app.use("/api/gallery", galleryRoutes);
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
