// Seeded by the test database fixtures: team 1 has an owner, an admin and a member.
export const owner = { id: 1, token: "test-owner-token" };
export const admin = { id: 2, token: "test-admin-token" };
export const user = { id: 3, token: "test-member-token" };
export const outsider = { id: 4, token: "test-outsider-token" };

export const authAs = (u: { token: string }) => ({ Authorization: `Bearer ${u.token}` });
