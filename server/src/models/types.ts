import {Request} from "express";

export interface UserModel {
    id: string;
    username: string;
    role: string;
    email: string;
    birthday: string;
    avatarUrl: string;
}
export interface CustomRequest extends Request {
    user: UserModel;
}