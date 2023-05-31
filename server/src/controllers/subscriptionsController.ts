import e, { NextFunction, Response } from "express";

import { Subscription } from "../models/models";
import { CustomRequest } from "../models/types";
import { ApiError } from "../error/ApiError";

import { BaseModelHelper } from "./BaseModelHelper";

class SubscriptionsController {
  public async getSubscriptionsByEventId(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { params: { eventId } } = request;
    const subscriptions = await BaseModelHelper.find({ Model: Subscription, where: { eventId }, next });
    return response.json(subscriptions);
  }

  public async getSubscriptionsByUserId(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user } = request;
    const subscriptions = await BaseModelHelper.find({ Model: Subscription, where: { userId: user.id }, next });
    return response.json(subscriptions);
  }


  public async subscribe(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
    const { user, params: { eventId } } = request;
    const subscription = await BaseModelHelper.create({
      Model: Subscription,
      next,
      values: { eventId, userId: user.id, subscriptionDate: new Date() }
    });
    return response.json(subscription);
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