import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

router.use(authenticate);

router.get("/", RoleController.getAllRoles);
router.get("/user/:userId", RoleController.getUserRoles);
router.post("/user/:userId", authorize("admin"), RoleController.assignRole);
router.delete("/user/:userId", authorize("admin"), RoleController.removeRole);

export default router;
