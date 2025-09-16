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

