import { apiClient } from "../../api/client";
import { resolveBaseURLFromEnv } from "../../utils/resolveBaseUrlEnv";
import storage from "../../utils/storage";
import type { User } from "../login/types";
import type { ProfileType, ResponseProfileData } from "./types";

const pathUrl = "api/v1/profile/";

type ResponseProfile = {
	user: User;
	profile: ProfileType;
};

export async function updateFieldProfile(userId: string, form: FormData) {
	const response = await apiClient.patch<ResponseProfile>(
		`${resolveBaseURLFromEnv()}/${pathUrl}${userId}`,
		form,
	);
	const { user } = response.data;
	storage.set("user", user);
	return response.data;
}

export async function getProfileData() {
	const response = await apiClient.get<ResponseProfileData>(
		`${resolveBaseURLFromEnv()}/${pathUrl}`,
	);

	return response.data;
}
