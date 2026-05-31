import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { AuditController } from "../controllers/audit.controller";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", AuditController.getLogs);

export default router;
