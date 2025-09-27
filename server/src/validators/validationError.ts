import { z } from "zod";

export type ApiValidationError = {
  msg: string;
  field?: string;
  location?: string;
};

export class ValidationError extends Error {
  public status: number = 400;
  public errors: ApiValidationError[];

  constructor(zodError: z.ZodError) {
    super("Validation failed");
    const apiErrors: ApiValidationError[] = zodError.issues.map((issue) => ({
      msg: issue.message,
      field: issue.path.join("."),
      location: "body",
    }));

    this.errors = apiErrors;
  }
}
