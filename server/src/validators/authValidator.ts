import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./authSchema";

type ApiValidationError = {
  msg: string;
  field?: string;
  location?: string;
};

type ValidateTypeSchema = typeof registerSchema | typeof loginSchema;

export const validateUserFields =
  (schema: ValidateTypeSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors: ApiValidationError[] = result.error.issues.map((issue) => ({
        msg: issue.message,
        field: issue.path.join("."),
        location: "body",
      }));
      return res.status(400).json({ error: errors });
    }
    next();
  };
