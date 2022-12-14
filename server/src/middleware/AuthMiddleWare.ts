import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function (
  req: Request,
  res: Response,
  next: (args?: any) => void
) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Не авторизован" });
    }

    if (!process.env.SECRET_KEY) {
      throw new Error(
        "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
      );
    }

    // @ts-ignore
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (e) {
    res.status(401).json({ message: "Не авторизован" });
  }
  return undefined;
}
