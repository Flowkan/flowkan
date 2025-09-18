"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .email("No es un email válido")
        .nonempty("Debe indicar un email")
        .trim(),
    password: zod_1.z
        .string()
        .nonempty("Debe informar la contraseña")
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    name: zod_1.z.string().nonempty("Debe indicar un nombre").trim(),
    photo: zod_1.z.string().optional().nullable(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("No es un email válido"),
    password: zod_1.z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
