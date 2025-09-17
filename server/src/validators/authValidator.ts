import { NextFunction, Request, Response } from "express";
import { changePasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "./authSchema";
import { ValidationError } from "./validationError";

export type AuthSchema = 
| typeof registerSchema 
| typeof loginSchema 
| typeof resetPasswordSchema
| typeof changePasswordSchema;

export const validateUserFields =
  (schema: AuthSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(new ValidationError(result.error));
    }
    next();
  };
