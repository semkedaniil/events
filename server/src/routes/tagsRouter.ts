import { Router } from "express";
import TagsController from "../controllers/tagsController";
const router = new (Router as any)();

router.get("/", TagsController.getTags)
router.post("/create", TagsController.createTag);

export { router };