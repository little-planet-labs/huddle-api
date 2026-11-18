import { db } from "./db";

export type Role = "owner" | "admin" | "member";

/** The user's role in the team, or null if they aren't a member. */
export async function getRole(teamId: number | string, userId: number): Promise<Role | null> {
  const result = await db.query(
    "SELECT role FROM team_members WHERE team_id = $1 AND user_id = $2",
    [teamId, userId]
  );
  return result.rows[0]?.role ?? null;
}

/** Owners and admins can manage membership. */
export function canManage(role: Role | null): boolean {
  return role === "owner" || role === "admin";
}
