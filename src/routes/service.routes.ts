import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";

const router = Router();

router.post("/verify-token", ServiceController.verifyToken);
router.get("/user/:userId", ServiceController.getUser);

export default router;
