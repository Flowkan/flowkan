import z from "zod";

export const ForgotPasswordSchema = z.object({
	email: z.email("No es un email válido").nonempty("Debe indicar un email"),
});

export const NewPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres"),
		confirmPassword: z.string().min(8, "Debe tener al menos 8 caracteres"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export const ResponseChangePasswordSchema = z.object({
	message: z.string(),
});

export const LoginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, { error: "El email es requerido" })
		.pipe(z.email({ error: "Debe ser un email válido" })),
	password: z
		.string()
		.trim()
		.check(({ value, issues }) => {
			if (value.length < 1) {
				issues.push({
					code: "custom",
					message: "La contraseña es requerida",
					input: value,
				});
				return;
			}
			if (value.length < 8) {
				issues.push({
					code: "custom",
					message: "Debe tener mínimo 8 caracteres",
					input: value,
				});
			}
		}),
});

export const RegisterFormSchema = z
	.object({
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
				if (value.length < 4) {
					issues.push({
						code: "custom",
						message: "Debe tener mínimo 4 caracteres",
						input: value,
					});
				}
			})
			.regex(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜàèìòùÀÈÌÒÙ]+$/, {
				error: "Su nombre solo debe contener letras, espacios y acentos",
			}),
		email: z
			.string()
			.trim()
			.min(1, { error: "El email es requerido" })
			.pipe(z.email({ error: "Debe ser un email válido" })),
		password: z
			.string()
			.trim()
			.check(({ value, issues }) => {
				if (value.length < 1) {
					issues.push({
						code: "custom",
						message: "La contraseña es requerida",
						input: value,
					});
					return;
				}
				if (value.length < 8) {
					issues.push({
						code: "custom",
						message: "Debe tener mínimo 8 caracteres",
						input: value,
					});
				}
			}),
		confirmPassword: z
			.string()
			.trim()
			.min(1, { error: "Se requiere confirmar su contraseña" }),
		photo: z.file().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});
