import { type Request, type Response, type NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AppError } from "./error.middleware";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    // Verify token and attach user to request
    const payload = await verifyAccessToken(token);
    req.user = payload;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};
