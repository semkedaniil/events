import path from "node:path";
import * as fs from "node:fs";

import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import { Op } from "sequelize";

import { ApiError } from "../error/ApiError";
import { User } from "../models/models";
import { sendEmail } from "../utils/mailer";

const generateJwt = (id: string, username: string, email: string, role: string, birthday: string, avatarUrl?: string): string => {
  if (!process.env.SECRET_KEY) {
    throw new Error(
      "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
    );
  }

  return jwt.sign({ id, username, role, email, birthday, avatarUrl }, process.env.SECRET_KEY, {
    expiresIn: "24h"
  });
};

class AuthController {
  public async registration(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      const { username, password, role, birthday, email } = request.body;
      if (!username || !password) {
        return next(ApiError.badRequest("Некорректный логин или пароль"));
      }
      const candidate = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
      if (candidate) {
        return next(
          ApiError.badRequest("Пользователь с таким логином уже существует")
        );
      }
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({ username, role, password: hashPassword, birthday, email });
      const token = generateJwt(
        user.getDataValue("id"),
        user.getDataValue("username"),
        user.getDataValue("email"),
        user.getDataValue("role"),
        user.getDataValue("birthday")
      );
      const status = await sendEmail(email, token);
      if (status === "") {
        return next(ApiError.internal("Сообщение не было отправлено"));
      }
      return response.json({ message: status });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async login(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      const { username, password } = request.body;

      if (!username || !password) {
        return next(ApiError.internal("Не указан email или password"));
      }
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return next(ApiError.internal("Пользователь не найден"));
      }
      const comparePassword = bcrypt.compareSync(
        password,
        user.getDataValue("password")
      );
      if (!comparePassword) {
        return next(ApiError.internal("Указан неверный пароль"));
      }
      const token = generateJwt(
        user.getDataValue("id"),
        user.getDataValue("username"),
        user.getDataValue("email"),
        user.getDataValue("role"),
        user.getDataValue("birthday")
      );
      return response.json({ token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async check(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      // @ts-ignore
      const { user: { username } } = request;
      const candidate = await User.findOne({ where: { username } });
      if (!candidate) {
        return next(ApiError.forbidden("Пользователь не найден"));
      }
      const token = generateJwt(candidate.getDataValue("id"),
        candidate.getDataValue("username"),
        candidate.getDataValue("email"),
        candidate.getDataValue("role"),
        candidate.getDataValue("birthday"),
        candidate.getDataValue("avatar"));
      return response.json({ token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async update(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      const {
        body: { username: name2Update, birthday: birthday2update },
        // @ts-ignore
        user: { id, username, role, email, birthday, avatarUrl }
      } = request;
      const candidate = await User.findOne({ where: { username: name2Update } });
      if (candidate && name2Update !== username) {
        return next(
          ApiError.badRequest("Пользователь с таким логином уже существует")
        );
      }
      const token = generateJwt(id, name2Update ?? username, email, role, birthday2update ?? birthday, avatarUrl);
      const [updatedRows] = await User.update({
        username: name2Update,
        birthday: birthday2update
      }, { where: { username } });
      if (updatedRows === 0) {
        return next(ApiError.badRequest("Что - то пошло не так..."));
      }
      return response.json({ token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async image(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      const {
        files,
        // @ts-ignore
        user: { id, username, role, email, birthday }
      } = request;
      let filename = "";
      if (files) {
        // @ts-ignore
        const { avatar } = files as [];
        if (avatar) {
          filename = `${v4().toString()}.${avatar?.mimetype.split("/")[1]}`;
          avatar.mv(path.join(__dirname, "..", "..", "static", filename));
        }
      } else {
        filename = "";
      }

      const user = await User.findOne({ where: { username } });
      user?.setDataValue("avatar", filename);
      await user?.save();
      const token = generateJwt(id, username, email, role, birthday, filename);
      return response.json({ token });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }

  public async deleteUserAvatar(request: Request, response: Response, next: (args: any) => void) {
      // @ts-ignore
    const { user: { id, username, email, role, birthday, avatarUrl } } = request;
      try {
        const user = await User.findOne({ where: { username } });
        user?.setDataValue("avatar", null);
        await user?.save();
        const avatarPath = path.join(__dirname, "..", "..", "static", avatarUrl);
        fs.unlink(avatarPath, (error) => {
          if (error) {
            next(ApiError.badRequest(error.message));
          }
        });
        const token = generateJwt(id, username, email, role, birthday, undefined);
        return response.json({ token });
      } catch (error) {
          next(ApiError.badRequest(error.message));
      }

      return undefined;
  }


  public async verify(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    try {
      // @ts-ignore
      const { query: { token } } = request;
      if (!token) {
        return next(ApiError.badRequest("Токен невалидный. Это могло произойти из-за истенеия срока действия. Пожалуйста, зарегистрируйтесь снова!"));
      }

      if (!process.env.SECRET_KEY) {
        throw new Error(
          "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
        );
      }

      const userInfo = jwt.verify(token as string, process.env.SECRET_KEY);
      // @ts-ignore
      if (typeof userInfo === "string" && !userInfo["email"]) {
        return response.json("Токен невалидный.");
      }
      // @ts-ignore
      const userModel = await User.findOne({ where: { email: userInfo.email } });
      const isConfirmed = userModel?.getDataValue("confirmed");
      if (isConfirmed) {
        return response.json({ message: "Пользователь уже подтвержден. Пожалуйста, войдите в аккаунт." });
      }

      userModel?.setDataValue("confirmed", true);
      await userModel?.save();
      return response.json({ message: "Ваш аккаунт успешно подтвержден!" });
    } catch (error) {
      next(ApiError.badRequest(error.message));
    }
    return undefined;
  }
}

// eslint-disable-next-line import/no-default-export
export default new AuthController();
