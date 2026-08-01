import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";
import { RoleModel } from "../models/role.model";
import bcrypt from "bcrypt";

export const UserService = {
  async getAllUsers() {
    const users = await UserModel.findAll();

    // Attach roles to each user
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        const roles = await RoleModel.findByUserId(user.id);
        return { ...user, roles: roles.map((r) => r.name) };
      }),
    );

    return usersWithRoles;
  },

  async createUser(email: string, password: string, role?: string) {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(email, hashedPassword);

    // Assign default user role
    const defaultRole = await RoleModel.findByName(role || "user");
    if (defaultRole) {
      await RoleModel.assignToUser(user.id, defaultRole.id);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async deleteUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    // Cascades to sessions, refresh_tokens, user_roles via ON DELETE CASCADE
    await UserModel.delete(userId);
  },
};
