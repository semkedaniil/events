import { Router } from "express";
import EventController from "../controllers/eventController";
const router = new (Router as any)();

router.get("/", EventController.getEvents);
router.get("/:id", EventController.getEvent);
router.get("/search", EventController.searchEvents);
router.post("/create", EventController.createEvent);

export { router };