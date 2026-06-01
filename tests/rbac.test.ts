process.env["NODE_ENV"] = "test";

import { describe, it, expect, beforeAll } from "bun:test";
import request from "supertest";
import app from "../src/app";

let adminToken: string;
let userToken: string;

describe("RBAC", () => {
  beforeAll(async () => {
    // Login as admin
    const adminRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    adminToken = adminRes.body.accessToken;

    // Login as regular user
    const userRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "regular@example.com", password: "password123" });
    userToken = userRes.body.accessToken;
  });

  it("should allow admin to access users list", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.users).toBeDefined();
  });

  it("should block regular user from accessing users list", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Insufficient permissions");
  });

  it("should block unauthenticated request", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(401);
  });
});
