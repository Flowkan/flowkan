import axios from "axios";
import { resolveBaseURLFromEnv } from "../utils/resolveBaseUrlEnv";

export const apiClient = axios.create({
	baseURL: `${resolveBaseURLFromEnv()}/${import.meta.env.API_VERSION}`,
});
