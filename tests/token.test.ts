import { describe, it, expect } from "bun:test";
import { generateAccessToken, verifyAccessToken } from "../src/utils/jwt";

describe("Token Flow", () => {
  it("should generate a valid access token", async () => {
    const token = await generateAccessToken({
      userId: "test-id",
      email: "test@example.com",
      roles: ["user"],
    });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3);
  });

  it("should verify a valid token", async () => {
    const token = await generateAccessToken({
      userId: "test-id",
      email: "test@example.com",
      roles: ["user"],
    });

    const payload = await verifyAccessToken(token);
    expect(payload.userId).toBe("test-id");
    expect(payload.email).toBe("test@example.com");
    expect(payload.roles).toContain("user");
  });

  it("should reject a tampered token", async () => {
    const token = await generateAccessToken({
      userId: "test-id",
      email: "test@example.com",
      roles: ["user"],
    });

    const parts = token.split(".");
    const tampered = `${parts[0]}.${parts[1]}TAMPERED.${parts[2]}`;

    expect(async () => {
      await verifyAccessToken(tampered);
    }).toThrow();
  });

  it("should reject an invalid token", async () => {
    expect(async () => {
      await verifyAccessToken("not.a.token");
    }).toThrow();
  });
});
