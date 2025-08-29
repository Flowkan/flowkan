import { apiClient } from "../../api/client";
import { BOARD_ENDPOINTS } from "../../utils/endpoints";
import type { Board, BoardData } from "./types";

export const getBoards = async (): Promise<Board[]> => {
	const response = await apiClient.get<Board[]>(BOARD_ENDPOINTS.BOARDS);
	return response.data;
};

export const createBoard = async (boardData: BoardData): Promise<Board> => {
	const response = await apiClient.post<Board>(
		BOARD_ENDPOINTS.BOARDS,
		boardData,
	);
	return response.data;
};

export const updateBoard = async (
	boardId: string,
	boardData: BoardData,
): Promise<Board> => {
	const response = await apiClient.put<Board>(
		`${BOARD_ENDPOINTS.BOARDS}/${boardId}`,
		boardData,
	);
	return response.data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
	await apiClient.delete(`${BOARD_ENDPOINTS.BOARDS}/${boardId}`);
};
