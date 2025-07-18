import { ZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http.error";

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      let err = error;
      if (err instanceof ZodError) {
        err = err.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        }));
      }
      next(new HttpError(400, "Validation error", err));
    }
  };
