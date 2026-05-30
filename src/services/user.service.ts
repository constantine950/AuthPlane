import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";
import { RoleModel } from "../models/role.model";

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

  async deleteUser(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    // Cascades to sessions, refresh_tokens, user_roles via ON DELETE CASCADE
    await UserModel.delete(userId);
  },
};
