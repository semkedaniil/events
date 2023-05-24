import { Router } from "express";
import EventController from "../controllers/eventController";
import authMiddleware from "../middleware/AuthMiddleWare";
const router = new (Router as any)();

router.get("/", authMiddleware, EventController.getEvents);
router.get("/user", authMiddleware, EventController.getUserEvents);
router.get("/search", authMiddleware, EventController.searchEvents);
router.post("/create", authMiddleware, EventController.createEvent);
router.get("/:id", authMiddleware, EventController.getEvent);

export { router };