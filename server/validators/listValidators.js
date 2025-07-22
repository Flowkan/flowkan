import { body, validationResult } from "express-validator";

export const validateListCreate = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isString()
    .withMessage("El título debe ser texto"),

  body("boardId").isInt().withMessage("El boardId debe ser un número entero"),

  body("position").isInt().withMessage("La posición debe ser un número entero"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
      });
    }
    next();
  },
];

export const validateListUpdate = [
  body("title").optional().isString().withMessage("El título debe ser texto"),

  body("position")
    .optional()
    .isInt()
    .withMessage("La posición debe ser un número entero"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.param, message: e.msg })),
      });
    }
    next();
  },
];
