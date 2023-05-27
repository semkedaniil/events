import e, {Request, Response} from "express";
import {Location} from "../models/models";
import {NextFunction} from "express";
import {BaseModelHelper} from "./BaseModelHelper";
import {CustomRequest} from "../models/types";

class LocationController {
    public async getLocations(_: Request, response: Response, next: NextFunction): Promise<e.Response | void> {
        const locations = await BaseModelHelper.find({Model: Location, next});
        return response.json(locations);
    }

    public async createLocation(request: CustomRequest, response: Response, next: NextFunction): Promise<e.Response | void> {
        const {eventId, longitude, latitude} = request.body;
        const location = await BaseModelHelper.create({Model: Location, next, values: {eventId, longitude, latitude}});
        return response.json(location);
    }
}

export default new LocationController();