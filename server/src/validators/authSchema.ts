import { z } from "zod";
import * as xss from "xss";

const escapeHTML = (val: string) => {
  return xss.filterXSS(val);
};

export const registerSchema = z.object({
  email: z
    .email("No es un email válido")
    .nonempty("Debe indicar un email")
    .trim()
    .transform(escapeHTML),
  password: z
    .string()
    .nonempty("Debe informar la contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .transform(escapeHTML),
  name: z.string().nonempty("Debe indicar un nombre").trim(),
  photo: z.string().optional().nullable(),
});

export const loginSchema = z.object({
  email: z.email("No es un email válido").transform(escapeHTML),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .transform(escapeHTML),
});

export const resetPasswordSchema = z.object({
  email: z.email("No es un email válido").transform(escapeHTML),
});

export const changePasswordSchema = z.object({
  password: z
    .string()
    .nonempty("Debe informar la contraseña")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .transform(escapeHTML),
});
