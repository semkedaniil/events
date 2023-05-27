import e, { NextFunction, Request, Response } from "express";
import { io } from "../index";
import { Mark } from "../models/models";
import { ApiError } from "../error/ApiError";

import { BaseModelHelper } from "./BaseModelHelper";
import {CustomRequest} from "../models/types";
import {EventController} from "./eventController";

class MarkController {
  public async getMarks(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    const marks = await BaseModelHelper.find({ Model: Mark, next });
    return response.json(marks);
  }

  public async createMark(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user: { id }, body: { isLiked }, params: { eventId } } = request;
    try {
      const markModel = await Mark.findOne({ where: { eventId, userId: id } });
      if (markModel) {
        await Mark.update({ isLiked, date: new Date() }, { where: { eventId, userId: id } });
      } else {
        await Mark.create({ eventId, userId: id, isLiked, date: new Date() });
      }
      if (eventId) {
        const event = await EventController.getEventById(eventId);
        io.emit("event updated", event);
      }
      response.json({ message: "Ok"});
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async updateMark(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user: { id }, body: { isLiked }, params: { eventId } } = request;
    try {
      const mark = await Mark.update({ isLiked, date: new Date() }, { where: { eventId, userId: id } });
      return response.json(mark);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }
}

// eslint-disable-next-line import/no-default-export
export default new MarkController();