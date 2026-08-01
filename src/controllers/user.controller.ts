import { type Request, type Response, type NextFunction } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";

export const UserController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      sendSuccess(res, { users });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const user = await UserService.createUser(email, password, role);
      sendSuccess(res, { message: "User created successfully", user }, 201);
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params["userId"] as string;
      await UserService.deleteUser(userId);
      sendSuccess(res, { message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
