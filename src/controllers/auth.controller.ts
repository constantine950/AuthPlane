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

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;

      if (!token) {
        res
          .status(401)
          .json({ success: false, message: "No refresh token provided" });
        return;
      }

      const { accessToken, newRefreshToken } = await AuthService.refresh(token);

      // Set new refresh token cookie (replaces old one)
      res.cookie("refreshToken", newRefreshToken, {
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

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;

      if (token) {
        await AuthService.logout(token);
      }

      // Clear the cookie regardless
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      sendSuccess(res, { message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  },
};
