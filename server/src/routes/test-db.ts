import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (_req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows[0]);
});

export default router;
