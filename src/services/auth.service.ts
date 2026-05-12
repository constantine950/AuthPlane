import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserModel } from "../models/user.model";
import { RefreshTokenModel } from "../models/refreshToken.model";
import { generateAccessToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

export const AuthService = {
  async register(email: string, password: string) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await UserModel.create(email, hashedPassword);
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(email: string, password: string) {
    // Check if user exists
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    // Generate access token
    const accessToken = await generateAccessToken({
      userId: user.id,
      email: user.email,
      roles: [],
    });

    // Generate refresh token (random string)
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshTokenModel.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  },
};
