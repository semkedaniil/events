import { Router } from "express";
import MarkController from "../controllers/markController";
const router = new (Router as any)();

router.get("/", MarkController.getMarks)
router.post("/create", MarkController.createMark)

export { router };