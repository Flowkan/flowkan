"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserFields = void 0;
const validationError_1 = require("./validationError");
const validateUserFields = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        return next(new validationError_1.ValidationError(result.error));
    }
    next();
};
exports.validateUserFields = validateUserFields;
