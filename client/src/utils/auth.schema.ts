import z from "zod";
import { t } from "i18next";

export const ForgotPasswordSchema = z.object({
	email: z
		.email(t("zod.errors.invalidEmail", "No es un email válido"))
		.nonempty(t("zod.errors.mandatoryEmail", "Debe indicar un email")),
});

export const NewPasswordSchema = z
	.object({
		password: z
			.string()
			.min(
				8,
				t(
					"zod.errors.psw.min",
					"La contraseña debe tener al menos 8 caracteres",
				),
			),
		confirmPassword: z
			.string()
			.min(
				8,
				t("zos.errors.psw.confirm.min", "Debe tener al menos 8 caracteres"),
			),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: t("zod.errors.psw.notMatch", "Las contraseñas no coinciden"),
		path: ["confirmPassword"],
	});

export const ResponseChangePasswordSchema = z.object({
	message: z.string(),
});

export const LoginFormSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, {
			error: t("zod.errors.loginForm.requiredEmail", "El email es requerido"),
		})
		.pipe(
			z.email({
				error: t("zod.errors.loginForm.validEmail", "Debe ser un email válido"),
			}),
		),
	password: z
		.string()
		.trim()
		.check(({ value, issues }) => {
			if (value.length < 1) {
				issues.push({
					code: "custom",
					message: t(
						"zod.errors.loginForm.requiredPsw",
						"La contraseña es requerida",
					),
					input: value,
				});
				return;
			}
			if (value.length < 8) {
				issues.push({
					code: "custom",
					message: t(
						"zod.errors.loginForm.minPsw",
						"Debe tener mínimo 8 caracteres",
					),
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
						message: t(
							"zod.errors.registerForm.requiredName",
							"El nombre es requerido",
						),
						input: value,
					});
					return;
				}
				if (value.length < 4) {
					issues.push({
						code: "custom",
						message: t(
							"zod.errors.registerForm.minName",
							"Debe tener mínimo 4 caracteres",
						),
						input: value,
					});
				}
			})
			.regex(/^[a-zA-Z\sñÑáéíóúÁÉÍÓÚüÜàèìòùÀÈÌÒÙ]+$/, {
				error: t(
					"zod.errors.registerForm.formatName",
					"Su nombre solo debe contener letras, espacios y acentos",
				),
			}),
		email: z
			.string()
			.trim()
			.min(1, {
				error: t(
					"zod.errors.registerForm.requiredEmail",
					"El email es requerido",
				),
			})
			.pipe(
				z.email({
					error: t(
						"zod.errors.registerForm.validEmail",
						"Debe ser un email válido",
					),
				}),
			),
		password: z
			.string()
			.trim()
			.check(({ value, issues }) => {
				if (value.length < 1) {
					issues.push({
						code: "custom",
						message: t(
							"zod.errors.registerForm.requiredPsw",
							"La contraseña es requerida",
						),
						input: value,
					});
					return;
				}
				if (value.length < 8) {
					issues.push({
						code: "custom",
						message: t(
							"zod.errors.registerForm.minPsw",
							"Debe tener mínimo 8 caracteres",
						),
						input: value,
					});
				}
			}),
		confirmPassword: z
			.string()
			.trim()
			.min(1, {
				error: t(
					"zod.errors.registerForm.confirmPsw",
					"Se requiere confirmar su contraseña",
				),
			}),
		photo: z.file().nullable(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		error: t(
			"zod.errors.registerForm.notMatchPsw",
			"Las contraseñas no coinciden",
		),
		path: ["confirmPassword"],
	});
