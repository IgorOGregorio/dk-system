import { NextFunction, Request, Response } from "express";
import {
  TopicHasSubtopicsError,
  TopicNotFoundError,
  TopicVersionNotFoundError,
} from "../errors/domain.error";
import { HttpError } from "../errors/http.error";

function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Handle specific domain errors and translate them to HTTP errors
  if (error instanceof TopicNotFoundError) {
    const status = 404;
    const message = error.message;
    const details = (error as any).details;
    console.error(`[Domain Error] ${status}: ${message}`, details);
    return res.status(status).json({ status, message, details });
  }

  if (error instanceof TopicVersionNotFoundError) {
    const status = 404;
    const message = error.message;
    const details = (error as any).details;
    console.log(`[Domain Error] ${status}: ${message}`, details);
    return res.status(status).json({ status, message, details });
  }

  if (error instanceof TopicHasSubtopicsError) {
    const status = 400;
    const message = error.message;
    const details = (error as any).details;
    console.log(`[Domain Error] ${status}: ${message}`, details);
    return res.status(status).json({ status, message, details });
  }

  // Handle pre-formatted HTTP errors
  if (error instanceof HttpError) {
    const { status, message, details } = error;
    console.error(`[HTTP Error] ${status}: ${message}`, details);
    return res.status(status).json({ status, message, details });
  }

  // Fallback for any other unexpected errors
  console.error(`[Internal Server Error] 500: ${error.message}`, error.stack);
  return res
    .status(500)
    .json({ status: 500, message: "Internal Server Error" });
}

export default errorMiddleware;
