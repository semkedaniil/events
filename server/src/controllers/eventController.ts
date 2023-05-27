import path from "node:path";
import fs from "node:fs";

import e, { NextFunction, Request, Response } from "express";
import { v4 } from "uuid";

import { Event, Mark, Location, Tag, Images, User } from "../models/models";
import { ApiError } from "../error/ApiError";

import { BaseModelHelper } from "./BaseModelHelper";

const serverUrl = process.env.BASE_SERVER_URL;
const mapEventModelsToEventDTO = (eventModel: any[]) => eventModel?.map((event: any) => ({
  id: event.id,
  name: event?.name,
  location: event?.location,
  dateRange: { startDate: event?.startDate, endDate: event?.endDate },
  creator: event?.user?.username,
  marks: {
    likes: event?.marks.filter((x: any) => x.dataValues.isLiked === true),
    dislikes: event?.marks?.filter((x: any) => x.dataValues.isLiked === false)
  },
  hidden: false,
  tags: event?.tags,
  description: event?.description,
  photos: event?.images.map((image: any) => `${serverUrl}${image.url}`)
})).filter((event: any) => event.location != null);

class EventController {
  public async getEvents(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    const events = await BaseModelHelper.find({
      Model: Event,
      next,
      include: [{ model: User, attributes: ["username"] }, Images, {
        model: Location,
        attributes: ["latitude", "longitude"]
      }, {
        model: Tag,
        attributes: ["name"]
      }, {
        model: Mark,
        attributes: ["isLiked", "userId"]
      }]
    });
    return response.json(mapEventModelsToEventDTO(events));
  }

  public async getEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { id } = request.params;
    try {
      const event = await Event.findOne({
        where: { id }, include: [{ model: User, attributes: ["username"] }, Images, {
          model: Location,
          attributes: ["latitude", "longitude"]
        }, {
          model: Tag,
          attributes: ["name"]
        }, {
          model: Mark,
          attributes: ["isLiked", "userId"]
        }]
      });
      return response.json(mapEventModelsToEventDTO([event])[0]);
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async getUserEvents(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    // @ts-ignore
    const { user: { id: userId } } = request;
    const events = await BaseModelHelper.find({
      Model: Event,
      where: { userId },
      next,
      include: [{ model: User, attributes: ["username"] }, Images, {
        model: Location,
        attributes: ["latitude", "longitude"]
      }, {
        model: Tag,
        attributes: ["name"]
      }, {
        model: Mark,
        attributes: ["isLiked", "userId"]
      }]
    });
    return response.json(mapEventModelsToEventDTO(events));
  }

  public async updateEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    // @ts-ignore
    const { user: { id: userId }, body } = request;
    const { id, name, description, dateRange, tags: tagsJson, location } = body;
    const tags = JSON.parse(tagsJson);
    const { startDate, endDate } = JSON.parse(dateRange);
    const { longitude, latitude } = JSON.parse(location);
    const { files } = request;
    try {
      await Event.update({
        userId,
        name,
        description,
        startDate,
        endDate
      }, { where: { id } });
      await Tag.destroy({
        where: {
          eventId: id
        }
      });
      await Tag.bulkCreate(tags.map((tag: string) => ({ eventId: id, name: tag })));
      await Location.update({ longitude, latitude },
        { where: { eventId: id } });
      if (files) {
        for (const photo of Object.values(files)) {
          if (!Array.isArray(photo)) {
            try {
              const filename = `${v4().toString()}.${photo?.mimetype.split("/")[1]}`;
              await photo.mv(path.join(__dirname, "..", "..", "static", filename));
              await Images.create({ eventId: id, url: filename });
            } catch {
              // ignore
            }
          }
        }
      }
      return response.json({ message: "Создан"});
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async deleteEventImage(request: Request, response: Response, next: NextFunction) {
    const { eventId, url } = request.body;
    const imageUrl = url.split(serverUrl)[1];
    try {
      await Images.destroy({ where: { eventId, url: imageUrl } });
      const avatarPath = path.join(__dirname, "..", "..", "static", imageUrl);
      fs.unlink(avatarPath, (error) => {
        if (error) {
          next(ApiError.badRequest(error.message));
        }
      });
      return response.json({ message: "Сообщение удалено" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }

    return undefined;
  }

  public async createEvent(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
    // @ts-ignore
    const { user: { id: userId, username: creator }, body } = request;
    const { name, description, dateRange, tags: tagsJson, location } = body;
    const tags = JSON.parse(tagsJson);
    const { startDate, endDate } = JSON.parse(dateRange);
    const { longitude, latitude } = JSON.parse(location);
    const { files } = request;
    try {
      const event = await Event.create({
        userId,
        name,
        description,
        startDate,
        endDate,
        tags: tags.map((tag: string) => ({ name: tag })),
        location: { longitude, latitude },
        marks: [{ isLiked: null, userId }]
      }, {
        include: [Tag, Location, Mark]
      });
      if (files) {
        for (const photo of Object.values(files)) {
          if (!Array.isArray(photo)) {
            try {
              const filename = `${v4().toString()}.${photo?.mimetype.split("/")[1]}`;
              await photo.mv(path.join(__dirname, "..", "..", "static", filename));
              await Images.create({ eventId: event?.getDataValue("id"), url: filename });
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
    return undefined;
  }
}

// eslint-disable-next-line import/no-default-export
export default new EventController();