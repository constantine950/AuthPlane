process.env["NODE_ENV"] = "test";

import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import app from "../src/app";
import pool from "../src/config/db";

const testUser = {
  email: `test_${Date.now()}@example.com`,
  password: "TestPassword123!",
};

let accessToken: string;
let cookies: string[];

describe("Auth Flow", () => {
  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email = $1", [testUser.email]);
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it("should not register duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBeDefined();

    accessToken = res.body.accessToken;
    cookies = res.headers["set-cookie"] as unknown as string[];
  });

  it("should not login with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: testUser.email, password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should not login with non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "password" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
