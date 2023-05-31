import { Router } from "express";

import SubscriptionsController from "../controllers/subscriptionsController";
import authMiddleWare from "../middleware/AuthMiddleWare";
const router = new (Router as any)();

router.post("/:eventId/subscribe", authMiddleWare, SubscriptionsController.subscribe)
router.put("/:eventId/unsubscribe", authMiddleWare, SubscriptionsController.unsubscribe)
router.get("/:eventId", authMiddleWare, SubscriptionsController.getSubscriptionsByEventId)
router.get("/user/:eventId", authMiddleWare, SubscriptionsController.getSubscriptionsEventsByUserId)

export { router };