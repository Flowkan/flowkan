import z from "zod";
import type { ForgotPasswordSchema, ResponseChangePasswordSchema } from "../../utils/auth.schema";


export interface Credentials {
	email: string;
	password: string;
}

export interface Login {
	accessToken: string;
}

export interface User {
	id: number;
	name: string;
	email: string;
	photo?: string;
}



export type FormSendEmail = z.infer<typeof ForgotPasswordSchema>

export type ResponseChangePassword = z.infer<typeof ResponseChangePasswordSchema>
