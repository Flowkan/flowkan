export interface UserRegister {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
	photo: File | null;
	turnstileResponse: string;
}
