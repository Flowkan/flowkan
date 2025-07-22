import { body, validationResult } from "express-validator";

export const validateUserFields = [
  body("email")
    .notEmpty()
    .withMessage("Debe indicar un email")
    .isEmail()
    .withMessage("No es un email valido")
    .trim()
    .escape(),

  body("password")
    .notEmpty()
    .withMessage("Debe informar la contraseña")
    .trim()
    .escape(),

  body("name")
    .optional()
    .notEmpty()
    .withMessage("Debe indicar un nombre")
    .trim()
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.param,
          message: err.msg,
        })),
      });
    }
    next();
  },
];
