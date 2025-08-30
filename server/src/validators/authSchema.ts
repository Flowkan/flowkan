import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .email("No es un email válido")
    .nonempty("Debe indicar un email")
    .trim(),
  password: z
    .string()
    .nonempty("Debe informar la contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
  name: z.string().nonempty("Debe indicar un nombre").trim(),
});

export const loginSchema = z.object({
  email: z.email("No es un email válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});
