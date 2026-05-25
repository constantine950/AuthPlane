import { Router } from "express";
import { RoleController } from "../controllers/role.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", RoleController.getAllRoles);
router.get("/user/:userId", RoleController.getUserRoles);
router.post("/user/:userId", RoleController.assignRole);
router.delete("/user/:userId", RoleController.removeRole);

export default router;
