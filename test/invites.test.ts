import request from "supertest";
import { app } from "../src/app";
import { admin, authAs, createInvite, user } from "./helpers";

describe("invites", () => {
  it("creates an invite", async () => {
    const res = await request(app)
      .post("/teams/1/invites").set(authAs(admin))
      .send({ email: "new@example.com", role: "member" });
    expect(res.status).toBe(201);
  });

  it("rejects expired invites", async () => {
    const invite = await createInvite({ expiresAt: new Date(Date.now() - 1000) });
    const res = await request(app).post(`/invites/${invite.token}/accept`).set(authAs(user));
    expect(res.status).toBe(410);
  });
});
