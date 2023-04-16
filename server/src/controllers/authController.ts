import e, {Request, Response} from "express";
import {ApiError} from "../error/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {User} from "../models/models";

const generateJwt = (id: string, username: string, role: string): string => {
    if (!process.env.SECRET_KEY) {
        throw new Error(
            "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
        );
    }

    return jwt.sign({id, username, role }, process.env.SECRET_KEY, {
        expiresIn: "24h",
    });
};

class AuthController {
    async registration(req: Request, res: Response, next: (args: any) => void): Promise<e.Response | void> {
        const {username, password, role, birthday, email} = req.body;
        if (!username || !password) {
            return next(ApiError.badRequest("Некорректный логин или пароль"));
        }
        const candidate = await User.findOne({where: {username}});
        if (candidate) {
            return next(
                ApiError.badRequest("Пользователь с таким логином уже существует")
            );
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({username, role, password: hashPassword, birthday, email});
        const token = generateJwt(
            user.getDataValue("id"),
            user.getDataValue("username"),
            user.getDataValue("role")
        );
        return res.json({token});
    }

    async login(req: Request, res: Response, next: (args: any) => void): Promise<e.Response | void> {
        const {username, password} = req.body;

        if (!username || !password) {
            return next(ApiError.internal("Не указан email или password"));
        }
        const user = await User.findOne({where: {username}});
        if (!user) {
            return next(ApiError.internal("Пользователь не найден"));
        }
        let comparePassword = bcrypt.compareSync(
            password,
            user.getDataValue("password")
        );
        if (!comparePassword) {
            return next(ApiError.internal("Указан неверный пароль"));
        }
        const token = generateJwt(
            user.getDataValue("id"),
            user.getDataValue("username"),
            user.getDataValue("role")
        );
        return res.json({token});
    }

    async check(req: Request, res: Response): Promise<e.Response> {
        // @ts-ignore
        const {user: {id, username, role}} = req;
        const token = generateJwt(id, username, role);
        return res.json({token});
    }
}

export default new AuthController();
