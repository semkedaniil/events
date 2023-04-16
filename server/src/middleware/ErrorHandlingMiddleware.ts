import { ApiError } from "../error/ApiError";
import e, { Request, Response } from "express";

export default function (
  error: any,
  _: Request,
  res: Response,
  __: (args: any) => void
): e.Response<any, Record<string, any>> {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({ message: "unexpected error" });
}
