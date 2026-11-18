import { Router } from "express";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { canManage, getRole } from "../teams";

const router = Router();

router.get("/teams/:teamId", requireAuth, async (req, res, next) => {
  try {
    const role = await getRole(req.params.teamId, req.user.id);
    if (!role) return res.status(404).json({ error: "Team not found" });

    const team = await db.query("SELECT id, name, created_at FROM teams WHERE id = $1", [req.params.teamId]);
    const members = await db.query(
      `SELECT u.id, u.email, m.role FROM team_members m
       JOIN users u ON u.id = m.user_id
       WHERE m.team_id = $1
       ORDER BY u.email`,
      [req.params.teamId]
    );
    res.json({ ...team.rows[0], members: members.rows });
  } catch (err) {
    next(err);
  }
});

router.delete("/teams/:teamId/members/:userId", requireAuth, async (req, res, next) => {
  try {
    const role = await getRole(req.params.teamId, req.user.id);
    if (!canManage(role)) return res.status(403).json({ error: "Only admins can remove members" });

    await db.query(
      "DELETE FROM team_members WHERE team_id = $1 AND user_id = $2 AND role <> 'owner'",
      [req.params.teamId, req.params.userId]
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
