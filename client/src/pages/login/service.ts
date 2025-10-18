import {
	apiClient,
	removeAuthorizationHeader,
	setAuthorizationHeader,
} from "../../api/client";
import type { Credentials, ResponseChangePassword } from "./types";
import storage from "../../utils/storage";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import { resolveBaseURLFromEnv } from "../../utils/resolveBaseUrlEnv";
import * as Sentry from "@sentry/react";

export const login = async (credentials: Credentials) => {
	const response = await apiClient.post<{
		accessToken: string;
		user: { id: number; name: string; email: string; photo?: string };
	}>(USER_ENDPOINTS.LOGIN, credentials);

	const { accessToken, user } = response.data;
	if (user) {
		storage.set("auth", accessToken);
		setAuthorizationHeader(accessToken);

		storage.set("user", user);
		Sentry.setUser({
			id: user.id.toString(),
			username: user.name,
			email: user.email,
		});

		return user;
	} else {
		return null;
	}
};

export const me = async () => {
	const response = await apiClient.get<{
		result: { id: number; name: string; email: string; photo?: string };
	}>(USER_ENDPOINTS.ME);

	return response.data.result;
};

export const logout = async () => {
	storage.remove("auth");
	storage.remove("user");
	removeAuthorizationHeader();
};

export const resetPassword = async (email: string) => {
	const response = await apiClient.post<{ message: string }>(
		USER_ENDPOINTS.RESET_PASSWORD,
		{
			email,
		},
	);
	return response.data;
};

export const changePassword = async (password: string, token: string) => {
	setAuthorizationHeader(token);
	const response = await apiClient.post<ResponseChangePassword>(
		USER_ENDPOINTS.CHANGE_PASSWORD,
		{
			password,
		},
	);
	return response.data;
};

export async function deactivateUser(): Promise<void> {
	const response = await apiClient.delete(
		`${resolveBaseURLFromEnv()}${USER_ENDPOINTS.DELETE_USER}`,
	);
	return response.data;
}
