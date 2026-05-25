import { type Request, type Response, type NextFunction } from "express";
import { RoleService } from "../services/role.service";
import { sendSuccess } from "../utils/response";

export const RoleController = {
  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await RoleService.getAllRoles();
      sendSuccess(res, { roles });
    } catch (error) {
      next(error);
    }
  },

  async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params["userId"] as string;
      const roles = await RoleService.getUserRoles(userId);
      sendSuccess(res, { roles });
    } catch (error) {
      next(error);
    }
  },

  async assignRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params["userId"] as string;
      const { role } = req.body;

      if (!role) {
        res.status(400).json({ success: false, message: "Role is required" });
        return;
      }

      const result = await RoleService.assignRole(userId, role);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  async removeRole(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params["userId"] as string;
      const { role } = req.body;

      if (!role) {
        res.status(400).json({ success: false, message: "Role is required" });
        return;
      }

      const result = await RoleService.removeRole(userId, role);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },
};
