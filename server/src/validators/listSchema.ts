import { z } from "zod";

export const listCreateSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: "El título solo puede contener letras y espacios",
    }),
  boardId: z.coerce.number().int({
    message: "El boardId debe ser un número entero",
  }),
  position: z.coerce.number().int({
    message: "La posición debe ser un número entero",
  }),
});

export const listUpdateSchema = z.object({
  title: z
    .string()
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: "El título solo puede contener letras y espacios",
    })
    .optional(),

  position: z.coerce
    .number()
    .int({ message: "La posición debe ser un número entero" })
    .optional(),
});
