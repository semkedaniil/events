import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";

// eslint-disable-next-line import/no-default-export
export default function (
  request: Request,
  response: Response,
  next: (args?: any) => void
): undefined | e.Response {
  if (request.method === "OPTIONS") {
    next();
  }

  try {
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return response.status(401).json({ message: "Не авторизован" });
    }
    if (!process.env.SECRET_KEY) {
      throw new Error(
        "Секретный ключ не обнаружен, введите в .env поле с SECRET_KEY"
      );
    }

    // @ts-ignore
    request.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (error) {
    response.status(401).json({ message: "Не авторизован" });
  }
  return undefined;
}
