import { type Request, type Response } from "express";
import { AuthService } from "../services/auth.service";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Basic validation
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
      console.error("Register error:", error); // only logs real unexpected errors
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
