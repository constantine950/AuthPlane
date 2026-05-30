import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import {
  loginRateLimit,
  registerRateLimit,
} from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register", registerRateLimit, AuthController.register);
router.post("/login", loginRateLimit, AuthController.login);
router.post("/refresh", AuthController.refresh);
router.post("/logout", AuthController.logout);

export default router;
