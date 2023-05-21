import e, {NextFunction, Request, Response} from "express";
import {Subscription} from "../models/models";
import {BaseModelHelper} from "./BaseModelHelper";

class SubscriptionsController {
    public async getSubscriptions(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const subscriptions = await BaseModelHelper.find({Model: Subscription, next});
        return response.json(subscriptions);
    }

    public async createSubscription(request: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {eventId, userId, subscriptionDate} = request.body;
        const subscription = await BaseModelHelper.create({
            Model: Subscription,
            next,
            values: {eventId, userId, subscriptionDate}
        });
        return response.json(subscription);
    }
}

export default new SubscriptionsController();