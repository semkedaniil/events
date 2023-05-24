import {ApiError} from "../error/ApiError";
import {NextFunction} from "express";

interface FindOptions {
    Model: any;
    include?: Array<any>;
    where?: any;
    next: NextFunction;
    raw?: boolean;
}

export class BaseModelHelper {
    public static async find({Model, include, next, where, raw}: FindOptions) {
        try {
            return await Model.findAll({include, where, raw });
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
        return undefined;
    }

    public static async create(params: { Model: any, values: any, next: NextFunction }) {
        const {Model, next, values} = params;
        try {
            return await Model.create(values);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }
        return undefined;
    }
}