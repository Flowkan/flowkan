import {
	apiClient,
	removeAuthorizationHeader,
	setAuthorizationHeader,
} from "../../api/client";
import type { Credentials } from "./types";
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

	return user;
};

export const logout = async () => {
	storage.remove("auth");
	removeAuthorizationHeader();
};
