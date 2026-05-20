import { Router } from "express";
import { SessionController } from "../controllers/session.controller";

const router = Router();

// All routes here will be protected by auth middleware
router.get("/", SessionController.getSessions);
router.delete("/:sessionId", SessionController.revokeSession);
router.delete("/", SessionController.revokeAllSessions);

export default router;
