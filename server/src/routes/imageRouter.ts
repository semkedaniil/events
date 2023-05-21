import {Router} from "express";
import ImagesController from "../controllers/imagesController";

const router = new (Router as any)();

router.get("/", ImagesController.getImage);
router.get("/:eventId", ImagesController.getImageByEventId);
router.post("/create", ImagesController.createImage);

export {router};