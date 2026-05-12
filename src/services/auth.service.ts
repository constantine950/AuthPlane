import bcrypt from "bcrypt";
import { UserModel } from "../models/user.model";

const SALT_ROUNDS = 10;

export const AuthService = {
  async register(email: string, password: string) {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    // Hash password with bcrypt (auto-generates salt)
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user in DB
    const user = await UserModel.create(email, hashedPassword);

    // Never return the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};
