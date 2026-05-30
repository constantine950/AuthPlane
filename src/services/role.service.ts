import { RoleModel } from "../models/role.model";
import { UserModel } from "../models/user.model";
import { AppError } from "../middleware/error.middleware";

export const RoleService = {
  async getAllRoles() {
    return await RoleModel.findAll();
  },

  async getUserRoles(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return await RoleModel.findByUserId(userId);
  },

  async assignRole(userId: string, roleName: string) {
    // Check user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check role exists
    const role = await RoleModel.findByName(roleName);
    if (!role) {
      throw new AppError(`Role '${roleName}' does not exist`, 404);
    }

    // Check user doesn't already have this role
    const userRoles = await RoleModel.findByUserId(userId);
    const alreadyAssigned = userRoles.some((r) => r.name === roleName);
    if (alreadyAssigned) {
      throw new AppError(`User already has role '${roleName}'`, 409);
    }

    await RoleModel.assignToUser(userId, role.id);
    return { message: `Role '${roleName}' assigned successfully` };
  },

  async removeRole(userId: string, roleName: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const role = await RoleModel.findByName(roleName);
    if (!role) {
      throw new AppError(`Role '${roleName}' does not exist`, 404);
    }

    // Prevent removing last role
    const userRoles = await RoleModel.findByUserId(userId);
    if (userRoles.length === 1) {
      throw new AppError("Cannot remove last role from user", 400);
    }

    // Prevent removing admin role if they are the last admin
    if (roleName === "admin") {
      const allUsers = await UserModel.findAll();
      const adminUsers = await Promise.all(
        allUsers.map(async (u) => {
          const roles = await RoleModel.findByUserId(u.id);
          return roles.some((r) => r.name === "admin") ? u : null;
        }),
      );
      const adminCount = adminUsers.filter(Boolean).length;
      if (adminCount <= 1) {
        throw new AppError("Cannot remove the last admin", 400);
      }
    }

    await RoleModel.removeFromUser(userId, role.id);
    return { message: `Role '${roleName}' removed successfully` };
  },
};
