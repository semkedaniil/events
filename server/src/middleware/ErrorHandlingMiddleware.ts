import { ApiError } from "../error/ApiError";
import { Request, Response } from "express";

export default function (
  error: any,
  _: Request,
  res: Response,
  __: (args: any) => void
) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(500).json({ message: "unexpected error" });
}
