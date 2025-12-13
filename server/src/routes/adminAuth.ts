import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // 1️⃣ Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  // 2️⃣ Check email
  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // 3️⃣ Check password
  const isMatch = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH as string
  );

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // 4️⃣ Create token
  const token = jwt.sign(
    { role: "admin", email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  // 5️⃣ Success
  res.status(200).json({ token });
});

export default router;
