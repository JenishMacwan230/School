import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import otpRoutes from "./routes/otp";
import adminPasswordRoutes from "./routes/adminPassword";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // 🔥 REQUIRED for cookies
  })
);

app.use(express.json());
app.use(cookieParser()); // 🔥 REQUIRED

/* ================= ROUTES ================= */
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminPasswordRoutes);
app.use("/otp", otpRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "OK" });
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
