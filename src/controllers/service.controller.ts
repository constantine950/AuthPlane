import { type Request, type Response, type NextFunction } from "express";
import { ServiceService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { AppError } from "../middleware/error.middleware";

export const ServiceController = {
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        throw new AppError("Token is required", 400);
      }

      const result = await ServiceService.verifyToken(token);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params["userId"] as string;
      const result = await ServiceService.getUser(userId);
      sendSuccess(res, { user: result });
    } catch (error) {
      next(error);
    }
  },
};
