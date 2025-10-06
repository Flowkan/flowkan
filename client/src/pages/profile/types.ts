import { z } from "zod";

const ERRORS = {
	min: (min: number) => `minimo ${min} carácteres`,
	max: (max: number) => `máximo ${max} carácteres`,
	email: "email inválido",
	nowhitespaces: "no debe contener espacios",
};

export const ProfileUpdateSchema = z.object({
	name: z
		.string()
		.trim()
		.check(({ value, issues }) => {
			if (value.length < 1) {
				issues.push({
					code: "custom",
					message: "El nombre es requerido",
					input: value,
				});
				return;
			}
			if (value.length < 5) {
				issues.push({
					code: "custom",
					message: "Debe tener mínimo 5 caracteres",
					input: value,
				});
			}
		}),
	email: z.email().readonly(),
	photo: z.file().or(z.string()).optional(),
	username: z
		.string()
		.trim()
		.check(({ value, issues }) => {
			if (value.length < 1) {
				issues.push({
					code: "custom",
					message: "Username debe ser mayor a 1 caracter",
					input: value,
				});
				return;
			}
			if (value.length < 5) {
				issues.push({
					code: "custom",
					message: "Debe tener mínimo 5 caracteres",
					input: value,
				});
			}
		})
		.refine((value) => !value.includes(" "), { message: ERRORS.nowhitespaces })
		.optional(),
	dateBirth: z
		.string()
		.refine((val) => !val || new Date(val) <= new Date(), {
			message: "La fecha no puede ser mayor a la fecha actual",
		})
		.optional(),
	location: z
		.string()
		.max(100, { error: ERRORS.max(100) })
		.optional(),
	allowNotifications: z.boolean(),
	bio: z
		.string()
		.trim()
		.check(({ value, issues }) => {
			if (value.length < 1) {
				issues.push({
					code: "custom",
					message: "Biografía debe ser mayor a 1 caracter",
					input: value,
				});
				return;
			}
			if (value.length < 10) {
				issues.push({
					code: "custom",
					message: "Debe tener mínimo 10 caracteres",
					input: value,
				});
			}
		})
        .max(500, { error: ERRORS.max(500) })
		.optional(),
});

export const ProfileUpdatedSchema = ProfileUpdateSchema.omit({
	photo: true,
	email: true,
}).extend({
	photo: z.file({error:"No es un archivo válido"}),
});

export const ProfileSchema = z.object({
	username: z.string(),
	dateBirth: z.string(),
	location: z.string(),
	allowNotifications: z.boolean(),
	bio: z.string(),
});

export const EditableUserSchema = z.object({
	name: z.string(),
	photo: z.string(),
});

export const EditableProfileSchema = z.object({
	username: z.string(),
	dateBirth: z.string(),
	location: z.string(),
	allowNotifications: z.boolean(),
	bio: z.string(),
});

export const ProfileCardSchema = z.object({
	user: EditableUserSchema,
	profile: EditableProfileSchema,
});

export const ResponseProfileSchema = z.object({
	error: z.string().nullable(),
	profile: ProfileSchema.nullable(),
});

export type ProfileUpdateType = z.infer<typeof ProfileUpdateSchema>;

export type ProfileUpdatedType = z.infer<typeof ProfileUpdatedSchema>;

export type ProfileType = z.infer<typeof ProfileSchema>;

export type ProfileCardType = z.infer<typeof ProfileCardSchema>;

export type ResponseProfileData = z.infer<typeof ResponseProfileSchema>;
