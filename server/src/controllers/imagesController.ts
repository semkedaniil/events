import e, {Request, Response} from "express";
import {v4} from "uuid";
import path from "node:path";
import {Images} from "../models/models";

class ImagesController {
    public async getImage(request: Request, response: Response): Promise<e.Response | void> {
        const {id} = request.body;
        const imagesUrl = await Images.findAll({
            where: {
                id
            }
        });
        return response.json(imagesUrl);
    }

    public async getImageByEventId(request: Request, response: Response): Promise<e.Response | void> {
        const {eventId} = request.params;
        const imagesUrls = await Images.findAll({
            where: {
                eventId
            }
        });
        return response.json(imagesUrls);
    }

    public async createImage(request: Request, response: Response): Promise<e.Response | void> {
        const {
            files,
            eventId
        } = request as any;
        const {photos} = files as any;
        for (const photo of photos) {
            if (photo) {
                try {
                    const filename = `${v4().toString()}.${photo?.mimetype.split("/")[1]}`;
                    photo.mv(path.join(__dirname, "..", "..", "static", filename));
                    await Images.create({eventId, url: filename});
                } catch {

                }
            }
        }
        response.json({message: "Фотографии созданы"});
    }

}

export default new ImagesController();