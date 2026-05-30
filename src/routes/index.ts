import { Router } from "express";
import authRoutes from "./auth.routes";
import sessionRoutes from "./session.routes";
import roleRoutes from "./role.routes";
import serviceRoutes from "./service.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);
router.use("/roles", roleRoutes);
router.use("/service", serviceRoutes);

export default router;
