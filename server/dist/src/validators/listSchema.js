"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUpdateSchema = exports.listCreateSchema = void 0;
const zod_1 = require("zod");
exports.listCreateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "El título es obligatorio")
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: "El título solo puede contener letras y espacios",
    }),
    boardId: zod_1.z.coerce.number().int({
        message: "El boardId debe ser un número entero",
    }),
    position: zod_1.z.coerce.number().int({
        message: "La posición debe ser un número entero",
    }),
});
exports.listUpdateSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
        message: "El título solo puede contener letras y espacios",
    })
        .optional(),
    position: zod_1.z.coerce
        .number()
        .int({ message: "La posición debe ser un número entero" })
        .optional(),
});
