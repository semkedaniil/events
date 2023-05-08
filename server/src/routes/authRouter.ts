import { Router } from "express";

import AuthController from "../controllers/authController";
import authMiddleware from "../middleware/AuthMiddleWare";

const router = new (Router as any)();

router.post("/registration", AuthController.registration);
router.post("/login", AuthController.login);
router.get("/auth", authMiddleware, AuthController.check);
router.put("/update", authMiddleware, AuthController.update);
router.post("/image", authMiddleware, AuthController.image);
router.get("/verify", AuthController.verify);


export { router };
