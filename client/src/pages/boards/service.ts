import { apiClient } from "../../api/client";
import {
	BOARD_ENDPOINTS,
	CARD_ENDPOINT,
	LABEL_ENDPOINTS,
	LIST_ENDPOINT,
} from "../../utils/endpoints";
import type { User } from "../login/types";
import type { Board, Column, Label, Task } from "./types";

export const getBoards = async (
	limit: number,
	skip: number,
): Promise<Board[]> => {
	const response = await apiClient.get<Board[]>(BOARD_ENDPOINTS.BOARDS, {
		params: { limit, skip },
	});

	return response.data;
};

export const createBoard = async (boardData: FormData): Promise<Board> => {
	const response = await apiClient.post<Board>(
		BOARD_ENDPOINTS.BOARDS,
		boardData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	);
	return response.data;
};

export const updateBoard = async (
	boardId: string,
	boardData: FormData,
): Promise<Board> => {
	const response = await apiClient.put<Board>(
		`${BOARD_ENDPOINTS.BOARDS}/${boardId}`,
		boardData,
		{ headers: { "Content-Type": "multipart/form-data" } },
	);
	return response.data;
};

export const deleteBoard = async (boardId: string): Promise<void> => {
	await apiClient.delete(`${BOARD_ENDPOINTS.BOARDS}/${boardId}`);
};

export const getBoard = async (boardId: string): Promise<Board> => {
	const idSlug = boardId.split("-")[0];
	const response = await apiClient.get<Board>(BOARD_ENDPOINTS.BY_ID(idSlug));
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
	data: Partial<Task> | FormData,
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

export const getBoardUsers = async (boardId: string): Promise<User[]> => {
	const response = await apiClient.get<User[]>(
		`${BOARD_ENDPOINTS.BY_ID(boardId)}/users`,
	);
	return response.data;
};

export const addAssignee = async (
	cardId: number,
	assigneeId: number,
): Promise<User> => {
	const { data } = await apiClient.post(`${CARD_ENDPOINT.CARDS}/addAssignee`, {
		cardId,
		assigneeId,
	});

	return data;
};

export const removeAssignee = async (
	cardId: number,
	assigneeId: number,
): Promise<void> => {
	await apiClient.delete(
		`${CARD_ENDPOINT.CARDS}/removeAssignee/${cardId}/${assigneeId}`,
	);
};

export const getBoardLabels = async (
	boardId: string | number,
): Promise<Label[]> => {
	const { data } = await apiClient.get<Label[]>(
		LABEL_ENDPOINTS.BY_BOARD(boardId),
	);
	return data;
};

export const createLabel = async (
	boardId: string | number,
	label: Pick<Label, "name" | "color">,
): Promise<Label> => {
	const { data } = await apiClient.post<Label>(
		LABEL_ENDPOINTS.BY_BOARD(boardId),
		label,
	);
	return data;
};

export const addLabelToCard = async (
	cardId: number,
	labelId: number,
): Promise<Task> => {
	return await apiClient.post(LABEL_ENDPOINTS.BY_CARD(cardId, labelId));
};

export const removeLabelFromCard = async (
	cardId: number,
	labelId: number,
): Promise<void> => {
	await apiClient.delete(LABEL_ENDPOINTS.BY_CARD(cardId, labelId));
};
