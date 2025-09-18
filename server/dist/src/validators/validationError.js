"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
class ValidationError extends Error {
    status = 400;
    errors;
    constructor(zodError) {
        super("Validation failed");
        const apiErrors = zodError.issues.map((issue) => ({
            msg: issue.message,
            field: issue.path.join("."),
            location: "body",
        }));
        this.errors = apiErrors;
    }
}
exports.ValidationError = ValidationError;
