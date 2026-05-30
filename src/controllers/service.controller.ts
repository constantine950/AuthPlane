import { type Request, type Response, type NextFunction } from "express";
import { ApiKeyService, ServiceService } from "../services/auth.service";
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

  async generateApiKey(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      if (!name) {
        throw new AppError("Name is required", 400);
      }

      const result = await ApiKeyService.generate(name);
      sendSuccess(
        res,
        {
          message:
            "API key generated. Store this key safely — it will not be shown again.",
          ...result,
        },
        201,
      );
    } catch (error) {
      next(error);
    }
  },
};
