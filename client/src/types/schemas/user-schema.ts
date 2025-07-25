import { z } from "zod";

export const CredentialsSchema = z.object({
	email: z.email("Email no válido").trim().normalize().toLowerCase(),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
	remember: z.boolean().optional(),
});
export type Credentials = z.infer<typeof CredentialsSchema>;

export const RegisterSchema = CredentialsSchema.extend({
	name: z.string().min(1, "El nombre es obligatorio").normalize(),
});
export type Register = z.infer<typeof RegisterSchema>;

export const UserSchema = z.object({
	id: z.number().int().nonnegative(), // o z.coerce.number() si necesario
	name: z.string(),
	email: z.string().email(),
});
export type User = z.infer<typeof UserSchema>;

export const AuthUserSchema = UserSchema.extend({
	createdAt: z.string(), // o z.coerce.date()
});
export type AuthUser = z.infer<typeof AuthUserSchema>;

export const JwtSchema = z.object({
	accessToken: z.string(),
});

export type Jwt = z.infer<typeof JwtSchema>;
