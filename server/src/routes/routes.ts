import { Router } from "express";
import { router as authRouter } from "./authRouter";

const router = new (Router as any)();

router.use("/user", authRouter);

export default router;