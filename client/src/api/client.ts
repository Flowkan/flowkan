import axios from "axios";
import { resolveBaseURLFromEnv } from "../utils/resolveBaseUrlEnv";

export const apiClient = axios.create({
	baseURL: `${resolveBaseURLFromEnv()}`,
});

export const setAuthorizationHeader = (accessToken: string) => {
	apiClient.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
};

export const removeAuthorizationHeader = () => {
	delete apiClient.defaults.headers["Authorization"];
};

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
