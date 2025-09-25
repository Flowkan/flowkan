import { NextFunction, Request, Response } from "express";
import { cardCreateSchema, cardUpdateSchema } from "./cardSchema";
import { ValidationError } from "./validationError";

export type CardSchema = typeof cardCreateSchema | typeof cardUpdateSchema;

export const validateCard =
  (schema: CardSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError(result.error));
    }
    next();
  };
