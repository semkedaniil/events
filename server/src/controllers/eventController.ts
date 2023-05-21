import e, {NextFunction, Request, Response} from "express";
import {Event, Mark, Location, Tag, Images} from "../models/models";
import {BaseModelHelper} from "./BaseModelHelper";
import {v4} from "uuid";
import path from "node:path";

class EventController {
    public async getEvents(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const events = await BaseModelHelper.find({Model: Event, next, include: [Images, Location, Tag, Mark]});
        return response.json(events);
    }

    public async getEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {id} = request.params;
        const events = await BaseModelHelper.find({
            Model: Event,
            next,
            where: {id},
            include: [Images, Location, Tag, Mark]
        });
        return response.json(events);
    }

    public async searchEvents(): Promise<e.Response | void> {
        // todo
        // const { /*...*/ } = request.body;
        // const events = await BaseModelHelper.find({
        //     Model: Event,
        //     next,
        //     where: {id},
        //     include: [Images, Location, Tag, Mark]
        // });
        // return response.json(events);
    }

    public async createEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {userId, name, description, startDate, endDate} = request.body;
        const {files} = request;
        const {photos} = files as any;
        const event = await BaseModelHelper.create({
            Model: Event,
            next,
            values: {userId, name, description, startDate, endDate},
        });

        if (photos) {
            for (const photo of photos) {
                if (photo) {
                    try {
                        const filename = `${v4().toString()}.${photo?.mimetype.split("/")[1]}`;
                        photo.mv(path.join(__dirname, "..", "..", "static", filename));
                        await Images.create({eventId: event?.getDataValue("id"), url: filename});
                    } catch {
                        //
                    }
                }
            }
        }
        return response.json(event);
    }
}

export default new EventController();