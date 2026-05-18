import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { generateAccessToken } from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";

const SALT_ROUNDS = 10;

export const AuthService = {
  async register(email: string, password: string) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create(email, hashedPassword);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, password: string) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: [],
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },

  async refresh(token: string) {
    // Find token in DB
    const storedToken = await RefreshTokenModel.findByToken(token);
    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // Check if revoked
    if (storedToken.is_revoked) {
      // Token reuse detected — potential theft
      throw new AppError("Refresh token reuse detected", 401);
    }

    // Check if expired
    if (new Date() > new Date(storedToken.expires_at)) {
      throw new AppError("Refresh token has expired", 401);
    }

    // Revoke old refresh token
    await RefreshTokenModel.revoke(token);

    // Generate new refresh token
    const newRefreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshTokenModel.create(
      storedToken.user_id,
      newRefreshToken,
      expiresAt,
    );

    // Generate new access token
    const accessToken = await generateAccessToken({
      userId: storedToken.user_id,
      email: storedToken.email,
      roles: [],
    });

    return { accessToken, newRefreshToken };
  },
};
