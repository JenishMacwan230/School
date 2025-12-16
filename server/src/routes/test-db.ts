import { Router } from "express";
import {pool} from "../db";

const router = Router();

router.get("/db-test", async (_req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM users");
  res.json({
    db: "connected",
    users: result.rows[0].count,
  });
});

export default router;
