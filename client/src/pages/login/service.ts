import {
	apiClient,
	removeAuthorizationHeader,
	setAuthorizationHeader,
} from "../../api/client";
import type { Login, Credentials } from "./types";
import storage from "../../utils/storage";
import { USER_ENDPOINTS } from "../../utils/endpoints";

export const login = async (credentials: Credentials) => {
	const response = await apiClient.post<Login>(
		USER_ENDPOINTS.LOGIN,
		credentials,
	);
	const { accessToken } = response.data;
	storage.set("auth", accessToken);

	setAuthorizationHeader(accessToken);
};

export const logout = async () => {
	storage.remove("auth");
	removeAuthorizationHeader();
};
