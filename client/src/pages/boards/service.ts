import { apiClient } from "../../api/client";
import {
	BOARD_ENDPOINTS,
	CARD_ENDPOINT,
	LIST_ENDPOINT,
} from "../../utils/endpoints";
import type { Board, BoardsData, Column, Task } from "./types";

export const getBoards = async (): Promise<Board[]> => {
	const response = await apiClient.get<Board[]>(BOARD_ENDPOINTS.BOARDS);
	return response.data;
};

export const createBoard = async (boardData: BoardsData): Promise<Board> => {
	const response = await apiClient.post<Board>(
		BOARD_ENDPOINTS.BOARDS,
		boardData,
		{ headers: { "Content-Type": "application/json" } },
	);
	return response.data;
};

export const updateBoard = async (
	boardId: string,
	boardData: BoardsData,
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

export const getBoard = async (boardId: string): Promise<Board> => {
	const response = await apiClient.get<Board>(BOARD_ENDPOINTS.BY_ID(boardId));
	return response.data;
};

export const createColumn = async (
	boardId: string,
	column: Column,
): Promise<Column> => {
	const response = await apiClient.post<Column>(LIST_ENDPOINT.LISTS, {
		...column,
		boardId,
	});
	return response.data;
};

export const updateColumn = async (
	columnId: string,
	data: Partial<Column>,
): Promise<Column> => {
	const response = await apiClient.put<Column>(
		LIST_ENDPOINT.BY_ID(columnId),
		data,
	);
	return response.data;
};

export const deleteColumn = async (columnId: string): Promise<void> => {
	await apiClient.delete(LIST_ENDPOINT.BY_ID(columnId));
};

export const createTask = async (
	listId: number,
	task: Partial<Task>,
): Promise<Task> => {
	const response = await apiClient.post<Task>(CARD_ENDPOINT.CARDS, {
		...task,
		listId,
	});
	return response.data;
};

export const updateTask = async (
	taskId: string,
	data: Partial<Task>,
): Promise<Task> => {
	const response = await apiClient.put<Task>(CARD_ENDPOINT.BY_ID(taskId), data);
	return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
	await apiClient.delete(CARD_ENDPOINT.BY_ID(taskId));
};

export const createInvitationLink = async (boardId: string) => {
	const response = await apiClient.get(
		`${BOARD_ENDPOINTS.BY_ID(boardId)}/share`,
	);
	return response.data;
};

export const acceptInvitation = async (
	boardId: string,
	invitationToken: string,
): Promise<void> => {
	const response = await apiClient.post(
		`${BOARD_ENDPOINTS.BY_ID(boardId)}/invite`,
		{
			token: invitationToken,
			boardId: boardId,
		},
	);
	return response.data;
};
