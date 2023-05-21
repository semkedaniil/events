import { Router } from "express";
import { router as authRouter } from "./authRouter";
import { router as eventsRouter } from "./eventsRouter";
import { router as marksRouter } from "./marksRouter";
import { router as tagsRouter } from "./tagsRouter";
import { router as locationRouter } from "./locationRouter";
import { router as subscriptionsRouter } from "./subscriptionsRouter";

const router = new (Router as any)();

router.use("/user", authRouter);
router.use("/events", eventsRouter);
router.use("/marks", marksRouter);
router.use("/tags", tagsRouter);
router.use("/locations", locationRouter);
router.use("/subscriptions", subscriptionsRouter);

export default router;