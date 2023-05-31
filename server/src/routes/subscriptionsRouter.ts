import { Router } from "express";

import SubscriptionsController from "../controllers/subscriptionsController";
const router = new (Router as any)();

router.post("/:id/subscribe", SubscriptionsController.subscribe)
router.put("/:id/unsubscribe", SubscriptionsController.unsubscribe)
router.get("/:id", SubscriptionsController.getSubscriptionsByEventId)
router.get("/user/:id", SubscriptionsController.getSubscriptionsByUserId)

export { router };