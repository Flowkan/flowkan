import { apiClient } from "../../api/client";
import { BOARD_ENDPOINTS } from "../../utils/endpoints";
import type { Board } from "./types";

export const getBoards = async (): Promise<Board[]> => {
	const response = await apiClient.get<Board[]>(BOARD_ENDPOINTS.BOARDS);
	return response.data;
};
