import { type Request, type Response, type NextFunction } from "express";
import { AppError } from "./error.middleware";

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = req.user?.roles;

    if (!userRoles || userRoles.length === 0) {
      throw new AppError("No roles assigned", 403);
    }

    const hasRole = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasRole) {
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  };
};
