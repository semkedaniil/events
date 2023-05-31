import e, { NextFunction, Response } from "express";

import { Subscription } from "../models/models";
import { CustomRequest } from "../models/types";
import { ApiError } from "../error/ApiError";

import { BaseModelHelper } from "./BaseModelHelper";
import { EventController } from "./eventController";

class SubscriptionsController {
  public async getSubscriptionsByEventId(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { params: { eventId } } = request;
    const subscriptions = await BaseModelHelper.find({ Model: Subscription, where: { eventId }, next });
    return response.json(subscriptions);
  }

  public async getSubscriptionsEventsByUserId(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user } = request;
    const subscriptions = await BaseModelHelper.find({ Model: Subscription, where: { userId: user.id }, next });
    const events = await EventController.getEventsByIds(subscriptions?.map((x: any) => x.getDataValue("eventId")));
    return response.json(events);
  }


  public async subscribe(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user: { id }, params: { eventId } } = request;
    const candidate = await Subscription.findOne({ where: { userId: id, eventId } });
    if (!candidate) {
      const subscription = await BaseModelHelper.create({
        Model: Subscription,
        next,
        values: { eventId, userId: id, subscriptionDate: new Date() }
      });
      return response.json(subscription);
    }
    next(ApiError.badRequest("Уже подписан"));
    return undefined;
  }

  public async unsubscribe(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user, params: { eventId } } = request;
    try {
      await Subscription.destroy({
        where: { eventId, userId: user.id }
      });
      return response.json("Отписка");
    } catch {
      next(ApiError.internal("Что - то пошло не так"));
    }
    return undefined;
  }
}

// eslint-disable-next-line import/no-default-export
export default new SubscriptionsController();