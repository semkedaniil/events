import { Router } from "express";
import EventController from "../controllers/eventController";
import authMiddleware from "../middleware/AuthMiddleWare";
const router = new (Router as any)();

router.get("/", authMiddleware, EventController.getEvents);
router.get("/:id", authMiddleware, EventController.getEvent);
router.get("/search", authMiddleware, EventController.searchEvents);
router.post("/create", authMiddleware, EventController.createEvent);

export { router };