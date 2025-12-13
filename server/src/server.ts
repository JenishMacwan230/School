
// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import adminAuthRoutes from "./routes/adminAuth";

// const app = express();

// app.use(express.json());

// console.log("Registering admin routes");
// app.use("/api/admin", adminAuthRoutes);

// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import adminRoutes from "./routes/admin";
import otpRoutes from "./routes/otp";
import adminPasswordRoutes from "./routes/adminPassword";




dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", adminPasswordRoutes);
app.use("/otp", otpRoutes);

app.get("/health", async (_req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
