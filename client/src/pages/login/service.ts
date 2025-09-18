import {
	apiClient,
	removeAuthorizationHeader,
	setAuthorizationHeader,
} from "../../api/client";
import type { Credentials, ResponseChangePassword } from "./types";
import storage from "../../utils/storage";
import { USER_ENDPOINTS } from "../../utils/endpoints";

export const login = async (credentials: Credentials) => {
	const response = await apiClient.post<{
		accessToken: string;
		user: { id: number; name: string; email: string; photo?: string };
	}>(USER_ENDPOINTS.LOGIN, credentials);

	const { accessToken, user } = response.data;

	storage.set("auth", accessToken);
	setAuthorizationHeader(accessToken);

	storage.set("user", user);

	return user;
};

export const logout = async () => {
	storage.remove("auth");
	storage.remove("user");
	removeAuthorizationHeader();
};


export const resetPassword = async (email:string) => {
	const response = await apiClient.post<{message:string}>(
		USER_ENDPOINTS.RESET_PASSWORD,{
			email
		}
	)
	return response.data
}

export const changePassword = async (password:string,token:string) => {
	setAuthorizationHeader(token)
	const response = await apiClient.post<ResponseChangePassword>(
		USER_ENDPOINTS.CHANGE_PASSWORD,{
			password
		}
	)	
	return response.data
}
