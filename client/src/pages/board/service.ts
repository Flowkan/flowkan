import { apiClient } from "../../api/client";
import {
	BOARD_ENDPOINTS,
	LIST_ENDPOINT,
	CARD_ENDPOINT,
} from "../../utils/endpoints";
import type { Column, Task, ColumnData, BoardData } from "./types";

export const getBoard = async (boardId: string): Promise<BoardData> => {
	const response = await apiClient.get<BoardData>(
		BOARD_ENDPOINTS.BY_ID(boardId),
	);
	return response.data;
};

export const createColumn = async (column: ColumnData): Promise<Column> => {
	const response = await apiClient.post<Column>(LIST_ENDPOINT.LISTS, column);
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

export const createTask = async (task: Task): Promise<Task> => {
	const response = await apiClient.post<Task>(CARD_ENDPOINT.CARDS, task);
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
