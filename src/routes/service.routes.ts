import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";
import { requireApiKey } from "../middleware/apiKey.middleware";

const router = Router();

// Admin only — generate API keys
router.post(
  "/api-keys",
  authenticate,
  authorize("admin"),
  ServiceController.generateApiKey,
);

// Protected by API key
router.post("/verify-token", requireApiKey, ServiceController.verifyToken);
router.get("/user/:userId", requireApiKey, ServiceController.getUser);

export default router;
