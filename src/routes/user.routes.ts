import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/rbac.middleware";

const router = Router();

router.use(authenticate);
router.use(authorize("admin"));

router.get("/", UserController.getAllUsers);
router.post("/", UserController.createUser);
router.delete("/:userId", UserController.deleteUser);

export default router;
