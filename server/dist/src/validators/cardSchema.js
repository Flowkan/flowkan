"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardUpdateSchema = exports.cardCreateSchema = void 0;
const zod_1 = require("zod");
exports.cardCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "El título es obligatorio")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: "El título solo puede contener letras y espacios",
    }),
    listId: zod_1.z.coerce
        .number()
        .int({ message: "El listId debe ser un número entero" }),
    position: zod_1.z.coerce
        .number()
        .int({ message: "La posición debe ser un número entero" }),
    description: zod_1.z
        .string()
        .regex(/^[\s\S]*$/, { message: "La descripción debe ser texto" })
        .optional(),
});
exports.cardUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "El título no puede estar vacío")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: "El título solo puede contener letras y espacios",
    })
        .optional(),
    description: zod_1.z
        .string()
        .regex(/^[\s\S]*$/, { message: "La descripción debe ser texto" })
        .optional(),
    position: zod_1.z.coerce
        .number()
        .int({ message: "La posición debe ser un número entero" })
        .optional(),
});
