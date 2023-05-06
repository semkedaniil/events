import e, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ApiError } from "../error/ApiError";
import { User } from "../models/models";
import { sendEmail } from "../utils/mailer";
// import { sendEmail } from "../utils/mailer";

const generateJwt = (id: string, username: string, email: string, role: string, birthday: string): string => {
  if (!process.env.SECRET_KEY) {
    throw new Error(
      "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
    );
  }

  return jwt.sign({ id, username, role, email, birthday }, process.env.SECRET_KEY, {
    expiresIn: "24h"
  });
};

class AuthController {
  public async registration(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    const { username, password, role, birthday, email } = request.body;
    if (!username || !password) {
      return next(ApiError.badRequest("Некорректный логин или пароль"));
    }
    const candidate = await User.findOne({ where: { username } });
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
    // console.log(token);
    // return response.json({ message: token });
    const status = await sendEmail(email, token);
    if (status === "") {
      return next(ApiError.internal("Сообщение не было отправлено"));
    }
    return response.json({ message: status });
  }

  public async login(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
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
  }

  public async check(request: Request, response: Response): Promise<e.Response> {
    // @ts-ignore
    const { user: { id, username, role, email, birthday } } = request;
    const token = generateJwt(id, username, email, role, birthday);
    return response.json({ token });
  }

  public async update(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
    const {
      body: { username: name2Update, birthday: birthday2update },
      // @ts-ignore
      user: { id, username, role, email, birthday }
    } = request;
    const candidate = await User.findOne({ where: { username: name2Update } });
    if (candidate && name2Update !== username) {
      return next(
        ApiError.badRequest("Пользователь с таким логином уже существует")
      );
    }
    const token = generateJwt(id, name2Update ?? username, email, role, birthday2update ?? birthday);
    const [updatedRows] = await User.update({ username: name2Update, birthday: birthday2update }, { where: { username } });
    if (updatedRows === 0) {
      return next(ApiError.badRequest("Что - то пошло не так..."));
    }
    return response.json({ token });
  }

  public async verify(request: Request, response: Response, next: (args: any) => void): Promise<e.Response | void> {
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
  }
}

// eslint-disable-next-line import/no-default-export
export default new AuthController();
