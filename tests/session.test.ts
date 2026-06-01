process.env["NODE_ENV"] = "test";

import { describe, it, expect, beforeAll } from "bun:test";
import request from "supertest";
import app from "../src/app";

let accessToken: string;
let cookies: string[];

describe("Session & Refresh Flow", () => {
  beforeAll(async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    accessToken = res.body.accessToken;
    const rawCookies = res.headers["set-cookie"];
    cookies = (Array.isArray(rawCookies) ? rawCookies : [rawCookies]).filter(
      (c): c is string => !!c,
    );
  });

  it("should refresh token and return new access token", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", cookies.join("; "));

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should fail refresh with no cookie", async () => {
    const res = await request(app).post("/api/auth/refresh");

    expect(res.status).toBe(401);
  });

  it("should logout successfully", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies.join("; "));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logged out successfully");
  });
});
