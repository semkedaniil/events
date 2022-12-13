import e, { Request, Response } from "express";
import { ApiError } from "../error/ApiError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/models";

const generateJwt = (id: string, email: string, role: string): string => {
  if (!process.env.SECRET_KEY) {
    throw new Error(
      "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
    );
  }

  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AuthController {
  async registration(req: Request, res: Response, next: (args: any) => void): Promise<e.Response | void> {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Некорректный логин или пароль"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким логином уже существует")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hashPassword });
    const token = generateJwt(
      user.getDataValue("id"),
      user.getDataValue("email"),
      user.getDataValue("role")
    );
    return res.json({ token });
  }

  async login(req: Request, res: Response, next: (args: any) => void): Promise<e.Response | void> {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
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
      user.getDataValue("email"),
      user.getDataValue("role")
    );
    return res.json({ token });
  }

  async check(req: Request, res: Response): Promise<e.Response> {
    // @ts-ignore
    const { user: { id, email, role } } = req;
    const token = generateJwt(id, email, role);
    return res.json({ token });
  }
}

export default new AuthController();
