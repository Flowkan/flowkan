import { apiClient } from "../../api/client";
import { USER_ENDPOINTS } from "../../utils/endpoints";
import type { UserRegister } from "./types";

export const register = async (user: UserRegister) => {
	await apiClient.post<UserRegister>(USER_ENDPOINTS.REGISTER, user, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
