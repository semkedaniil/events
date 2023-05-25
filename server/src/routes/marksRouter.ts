import { Router } from "express";

import MarkController from "../controllers/markController";
import authMiddleWare from "../middleware/AuthMiddleWare";

const router = new (Router as any)();

router.get("/", MarkController.getMarks);
router.post("/:eventId", authMiddleWare, MarkController.createMark);
router.put("/:eventId", authMiddleWare, MarkController.createMark);

export { router };