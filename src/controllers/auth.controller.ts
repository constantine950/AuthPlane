import { type Request, type Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const user = await AuthService.register(email, password);
      res.status(201).json({ message: "User registered successfully", user });
    } catch (error: any) {
      if (error.message === "Email already exists") {
        res.status(409).json({ message: error.message });
        return;
      }
      console.error("Register error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password,
      );

      // Set refresh token as HttpOnly cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      res.status(200).json({ accessToken });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        res.status(401).json({ message: error.message });
        return;
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
