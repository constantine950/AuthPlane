import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { generateAccessToken, verifyAccessToken } from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";
import { SessionModel } from "../models/session.model";
import { RoleModel } from "../models/role.model";

const SALT_ROUNDS = 10;

export const AuthService = {
  async register(email: string, password: string) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create(email, hashedPassword);

    // Assign default 'user' role
    const userRole = await RoleModel.findByName("user");
    if (userRole) {
      await RoleModel.assignToUser(user.id, userRole.id);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(
    email: string,
    password: string,
    device: string,
    ipAddress: string,
  ) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Create session
    const session = await SessionModel.create(user.id, device, ipAddress);

    // Get user roles
    const roles = await RoleModel.findByUserId(user.id);
    const roleNames = roles.map((r) => r.name);

    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: roleNames,
    });

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshTokenModel.create(
      user.id,
      refreshToken,
      expiresAt,
      session.id,
    );

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
      storedToken.session_id,
    );

    // Generate new access token
    const accessToken = await generateAccessToken({
      userId: storedToken.user_id,
      email: storedToken.email,
      roles: [],
    });

    return { accessToken, newRefreshToken };
  },

  async logout(token: string) {
    // Revoke refresh token if it exists — silent if not found
    const storedToken = await RefreshTokenModel.findByToken(token);
    if (storedToken) {
      await RefreshTokenModel.revoke(token);
    }
  },
};

export const ServiceService = {
  async verifyToken(token: string) {
    try {
      const payload = await verifyAccessToken(token);
      return {
        valid: true,
        user: {
          userId: payload.userId,
          email: payload.email,
          roles: payload.roles,
        },
      };
    } catch {
      return { valid: false, user: null };
    }
  },

  async getUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const roles = await RoleModel.findByUserId(userId);
    const { password: _, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      roles: roles.map((r) => r.name),
    };
  },
};
