import { type Request, type Response, type NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const user = await AuthService.register(email, password);
      sendSuccess(res, { message: "User registered successfully", user }, 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res
          .status(400)
          .json({ success: false, message: "Email and password are required" });
        return;
      }

      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password,
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { accessToken });
    } catch (error) {
      next(error);
    }
  },
};
