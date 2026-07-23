import { Router } from "express";
import { SessionController } from "../controllers/session.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", SessionController.getSessions);
router.delete("/:sessionId", SessionController.revokeSession);
router.delete("/", SessionController.revokeAllSessions);

export default router;
