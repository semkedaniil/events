import { Router } from "express";
import SubscriptionsController from "../controllers/subscriptionsController";
const router = new (Router as any)();

router.get("/", SubscriptionsController.getSubscriptions)
router.post("/create", SubscriptionsController.createSubscription)

export { router };