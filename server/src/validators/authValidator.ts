import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./authSchema";
import { ValidationError } from "./validationError";

export type ValidateTypeSchema = typeof registerSchema | typeof loginSchema;

export const validateUserFields =
  (schema: ValidateTypeSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError(result.error));
    }
    next();
  };
