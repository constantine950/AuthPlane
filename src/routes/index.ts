import { Router } from "express";
import authRoutes from "./auth.routes";
import sessionRoutes from "./session.routes";
import roleRoutes from "./role.routes";
import serviceRoutes from "./service.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);
router.use("/roles", roleRoutes);
router.use("/service", serviceRoutes);
router.use("/users", userRoutes);

export default router;
