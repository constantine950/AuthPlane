import { type Request, type Response, type NextFunction } from "express";
import { createHash } from "crypto";
import { ApiKeyModel } from "../models/apiKey.model";
import { AppError } from "./error.middleware";

export const requireApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      throw new AppError("API key required", 401);
    }

    // Hash the incoming key and look it up in DB
    const keyHash = createHash("sha256").update(apiKey).digest("hex");
    const storedKey = await ApiKeyModel.findByHash(keyHash);

    if (!storedKey) {
      throw new AppError("Invalid API key", 401);
    }

    next();
  } catch (error) {
    next(error);
  }
};
