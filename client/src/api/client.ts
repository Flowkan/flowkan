import axios from "axios";
import { resolveBaseURLFromEnv } from "../utils/resolveBaseUrlEnv";
import { type AppDispatch, type Router } from "../store";
import { logout } from "../store/auth/actions";
import toast from "react-hot-toast";

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

export const responseJwtInterceptors = (
	dispatch: AppDispatch,
	router: Router,
) => {
	apiClient.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error.response?.status === 401) {
				toast.error("Tu sesión ha expirado, inicia sesión nuevamente.", {
					id: "session-expired",
				});
				localStorage.removeItem("auth");
				localStorage.removeItem("user");
				dispatch(logout());
				setTimeout(() => {
					router.navigate("/login", { replace: true });
				}, 1500);
			}
			return Promise.reject(error);
		},
	);
};
