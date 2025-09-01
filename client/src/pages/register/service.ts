import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { User } from "./types";

export const register = async (user: User) => {
	await apiClient.post<User>(USER_ENDPOINTS.REGISTER, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
