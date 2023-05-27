import { Router } from "express";

import EventController from "../controllers/eventController";
import authMiddleware from "../middleware/AuthMiddleWare";
const router = new (Router as any)();

router.get("/", authMiddleware, EventController.getEvents);
router.get("/user", authMiddleware, EventController.getUserEvents);
router.post("/create", authMiddleware, EventController.createEvent);
router.put("/image/delete", authMiddleware, EventController.deleteEventImage);
router.put("/:id", authMiddleware, EventController.updateEvent);
router.get("/:id", authMiddleware, EventController.getEvent);

export { router };