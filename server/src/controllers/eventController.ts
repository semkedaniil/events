import e, {NextFunction, Request, Response} from "express";
import {Event, Mark, Location, Tag, Images, User} from "../models/models";
import {BaseModelHelper} from "./BaseModelHelper";
import {v4} from "uuid";
import path from "node:path";
import {ApiError} from "../error/ApiError";

const mapEventModelsToEventDTO = (eventModel: any[]) => {
    return eventModel?.map((event: any) => {
        const marks = event?.marks?.filter((x: any) => x.isLked).length;
        return ({
            id: event.id,
            name: event?.name,
            location: event?.location,
            dateRange: {startDate: event?.startDate, endDate: event?.endDate},
            creator: event?.user?.username,
            marks: {
                likes: marks ?? 0,
                dislikes: (marks && (event?.marks?.length - marks)) ?? 0,
            },
            hidden: false,
            tags: event?.tags,
            description: event?.description,
            photos: event?.images.map((image: any) => `http://localhost:5000/${image.url}`),
        });
    }).filter((event: any) => event.location != null);
}
class EventController {
    public async getEvents(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const events = await BaseModelHelper.find({
            Model: Event,
            next,
            include: [{model: User, attributes: ["username"]}, Images, {
                model: Location,
                attributes: ["latitude", "longitude"]
            }, {
                model: Tag,
                attributes: ["name"],
            }, {
                model: Mark,
                attributes: ["isLiked"],
            }],
        });
        return response.json(mapEventModelsToEventDTO(events));
    }

    public async getEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {id} = request.params;
        const events = await BaseModelHelper.find({
            Model: Event,
            next,
            where: {id},
            include: [{model: User, attributes: ["username"]}, Images, Location, Tag, Mark]
        });
        return response.json(events);
    }

    public async getUserEvents(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        // @ts-ignore
        const {user: {id: userId}} = request;
        const events = await BaseModelHelper.find({
            Model: Event,
            where: {userId},
            next,
            include: [{model: User, attributes: ["username"]}, Images, {
                model: Location,
                attributes: ["latitude", "longitude"]
            }, {
                model: Tag,
                attributes: ["name"],
            }, {
                model: Mark,
                attributes: ["isLiked"],
            }],
        });
        return response.json(mapEventModelsToEventDTO(events));
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
        // @ts-ignore
        const {user: {id: userId, username: creator}} = request;
        const {name, description, dateRange, tags: tagsJson, location} = request.body;
        const tags = JSON.parse(tagsJson);
        const {startDate, endDate} = JSON.parse(dateRange);
        const {longitude, latitude} = JSON.parse(location);
        const {files} = request;
        try {
            const event = await Event.create({
                userId,
                name,
                description,
                startDate,
                endDate,
                tags: tags.map((tag: string) => ({name: tag})),
                location: {longitude, latitude},
            }, {
                include: [Tag, Location]
            });
            if (files) {
                for (const photo of Object.values(files)) {
                    if (!Array.isArray(photo)) {
                        try {
                            const filename = `${v4().toString()}.${photo?.mimetype.split("/")[1]}`;
                            await photo.mv(path.join(__dirname, "..", "..", "static", filename));
                            await Images.create({eventId: event?.getDataValue("id"), url: filename});
                        } catch {
                            //
                        }
                    }
                }
            }
            return response.json(event);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
    }
}

export default new EventController();