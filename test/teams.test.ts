import request from "supertest";
import { app } from "../src/app";
import { admin, authAs, outsider, user } from "./helpers";

describe("teams", () => {
  it("shows a team to its members", async () => {
    const res = await request(app).get("/teams/1").set(authAs(user));
    expect(res.status).toBe(200);
    expect(res.body.members.length).toBeGreaterThan(0);
  });

  it("hides a team from non-members", async () => {
    const res = await request(app).get("/teams/1").set(authAs(outsider));
    expect(res.status).toBe(404);
  });

  it("only lets admins remove members", async () => {
    const res = await request(app).delete(`/teams/1/members/${admin.id}`).set(authAs(user));
    expect(res.status).toBe(403);
  });
});
