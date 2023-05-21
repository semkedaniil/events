import e, {NextFunction, Request, Response} from "express";
import {Mark} from "../models/models";
import {BaseModelHelper} from "./BaseModelHelper";

class MarkController {
    public async getMarks(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const marks = await BaseModelHelper.find({Model: Mark, next});
        return response.json(marks);
    }

    public async createMark(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {eventId, isLiked, date} = request.body;
        const mark = await BaseModelHelper.create({ Model: Mark, next, values: {eventId, isLiked, date} });
        return response.json(mark);
    }
}

export default new MarkController();