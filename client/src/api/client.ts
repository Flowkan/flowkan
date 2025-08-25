import axios from "axios";
import { resolveBaseURLFromEnv } from "../utils/resolveBaseUrlEnv";

<<<<<<< HEAD
export const client = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL_URL,
});

export const setAuthorizationHeader = (accessToken: string) => {
	client.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
};

export const removeAuthorizationHeader = () => {
	delete client.defaults.headers["Authorization"];
};

client.interceptors.request.use((config) => {
	const token = localStorage.getItem("authToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
=======
export const apiClient = axios.create({
	baseURL: `${resolveBaseURLFromEnv()}/${import.meta.env.API_VERSION}`,
});
>>>>>>> main
