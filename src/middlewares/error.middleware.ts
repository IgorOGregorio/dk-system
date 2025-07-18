import { NextFunction, Request, Response } from "express";
import { HttpException } from "../exceptions/http.exception";

function errorMiddleware(
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  const details = error.details || null;
  console.error(`[Error] ${status}: ${message}`, details);
  res.status(status).json({
    status,
    message,
    details,
  });
}

export default errorMiddleware;
