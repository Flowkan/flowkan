import { NextFunction, Request, Response } from "express";
import { listCreateSchema, listUpdateSchema } from "./listSchema";
import { ValidationError } from "./validationError";

export type ListSchema = typeof listCreateSchema | typeof listUpdateSchema;

export const validateList =
  (schema: ListSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError(result.error));
    }
    next();
  };