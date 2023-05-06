import e, { Request, Response } from "express";
import jwt from "jsonwebtoken";

export default function (role: string): (req: e.Request, res: e.Response, next: (args?: any) => void) => (e.Response<any, Record<string, any>> | undefined) {
  return function (req: Request, res: Response, next: (args?: any) => void): undefined | e.Response<any, Record<string, any>> {
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

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      // @ts-ignore
      if (decoded.role !== role) {
        res.status(403).json({ message: "Нет доступа" });
      }
      // @ts-ignore
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: "Не авторизован" });
    }
    return undefined;
  };
}
