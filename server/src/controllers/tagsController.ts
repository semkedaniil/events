import e, {NextFunction, Request, Response} from "express";
import {Tag} from "../models/models";
import {BaseModelHelper} from "./BaseModelHelper";

class TagsController {
    public async getTags(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const tags = await BaseModelHelper.find({Model: Tag, next});
        return response.json(tags);
    }

    public async createTag(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {name} = request.body;
        const tag = await BaseModelHelper.create({Model: Tag, next, values: {name}});
        return response.json(tag);
    }
}

export default new TagsController();