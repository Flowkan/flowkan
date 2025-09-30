import { z } from "zod";

export const cardCreateSchema = z.object({
  title: z
    .string()
    .min(1, "El título es obligatorio")
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: "El título solo puede contener letras y espacios",
    }),
  listId: z.coerce
    .number()
    .int({ message: "El listId debe ser un número entero" }),
  position: z.coerce
    .number()
    .int({ message: "La posición debe ser un número entero" }),
  description: z
    .string()
    .regex(/^[\s\S]*$/, { message: "La descripción debe ser texto" })
    .optional(),
});

export const cardUpdateSchema = z
  .object({
    title: z
      .string()
      .min(1, "El título no puede estar vacío")
      .regex(/^[\w\s.,:;!?¿¡-ÁÉÍÓÚáéíóúÑñ()]+$/, {
        message:
          "El título solo puede contener letras, números, espacios y signos de puntuación",
      })
      .optional(),
    description: z
      .string()
      .regex(/^[\s\S]*$/, { message: "La descripción debe ser texto" })
      .optional(),
    position: z.coerce
      .number()
      .int({ message: "La posición debe ser un número entero" })
      .optional(),
  })
  .loose();
