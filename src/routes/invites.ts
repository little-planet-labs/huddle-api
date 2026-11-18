import { Router } from "express";
import crypto from "crypto";
import { db } from "../db";
import { requireAuth } from "../middleware/auth";
import { sendEmail } from "../email";

const router = Router();
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

router.post("/teams/:teamId/invites", requireAuth, async (req, res) => {
  const { teamId } = req.params;
  const { email, role } = req.body;

  const membership = await db.query(
    "SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2",
    [teamId, req.user.id]
  );
  if (membership.rows.length === 0) {
    return res.status(403).json({ error: "Not a member of this team" });
  }

  const token = Math.random().toString(36).slice(2);
  const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

  await db.query(
    "INSERT INTO invites (team_id, email, role, token, expires_at) VALUES ($1, $2, $3, $4, $5)",
    [teamId, email.toLowerCase(), role, token, expiresAt]
  );

  sendEmail(email, "You're invited!", `Join here: ${process.env.APP_URL}/invites/${token}`);

  res.status(201).json({ ok: true });
});

router.get("/teams/:teamId/invites", requireAuth, async (req, res) => {
  const { status = "pending" } = req.query;
  const result = await db.query(
    `SELECT id, email, role, created_at FROM invites
     WHERE team_id = $1 AND status = '${status}'
     ORDER BY created_at DESC`,
    [req.params.teamId]
  );
  res.json(result.rows);
});

router.post("/invites/:token/accept", requireAuth, async (req, res) => {
  const result = await db.query("SELECT * FROM invites WHERE token = $1", [req.params.token]);
  const invite = result.rows[0];
  if (!invite) return res.status(404).json({ error: "Invite not found" });

  if (invite.expires_at < Date.now()) {
    return res.status(410).json({ error: "Invite expired" });
  }

  await db.query(
    "INSERT INTO team_members (team_id, user_id, role) VALUES ($1, $2, $3)",
    [invite.team_id, req.user.id, invite.role]
  );
  await db.query("UPDATE invites SET status = 'accepted' WHERE id = $1", [invite.id]);

  res.json({ teamId: invite.team_id });
});

export default router;
