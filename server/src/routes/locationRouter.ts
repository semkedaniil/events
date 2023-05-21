import { Router } from "express";
import LocationController from "../controllers/locationController";
const router = new (Router as any)();

router.get("/", LocationController.getLocations)
router.post("/create", LocationController.createLocation)

export { router };