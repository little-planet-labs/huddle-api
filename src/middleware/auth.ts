import type { NextFunction, Request, Response } from "express";
import { db } from "../db";

declare global {
  namespace Express {
    interface Request {
      user: { id: number; email: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.header("authorization")?.replace(/^Bearer /, "");
    if (!token) return res.status(401).json({ error: "Not signed in" });

    const result = await db.query(
      `SELECT u.id, u.email FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > now()`,
      [token]
    );
    if (result.rows.length === 0) return res.status(401).json({ error: "Not signed in" });

    req.user = result.rows[0];
    next();
  } catch (err) {
    next(err);
  }
}
