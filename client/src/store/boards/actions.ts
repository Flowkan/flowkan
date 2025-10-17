import type { AppThunk } from "..";
import type { User } from "../../pages/login/types";
import type {
	Board,
	Column,
	Label,
	LimitErrorData,
	Task,
} from "../../pages/boards/types";
import type { DropResult } from "@hello-pangea/dnd";
import type { AuthActions, AuthActionsRejected } from "../auth/actions";
import type {
	ProfileActions,
	ProfileActionsRejected,
	UserActions,
	UserActionsRejected,
} from "../profile/actions";
import { AxiosError } from "axios";

//
// ─── BOARDS ──────────────────────────────────────────────
//
type UpdateRemoteBoard = {
	type: "boards/update/remote";
	payload: DropResult;
};
export const updateRemoteBoard = (result: DropResult): UpdateRemoteBoard => ({
	type: "boards/update/remote",
	payload: result,
});

type FetchBoardsPending = { type: "boards/fetchBoards/pending" };
type FetchBoardsFulfilled = {
	type: "boards/fetchBoards/fulfilled";
	payload: {
		boards: Board[];
		pagination: {
			page: number;
			totalPages: number;
			hasNextPage: boolean;
			hasPrevPage: boolean;
		};
	};
};
type FetchBoardsRejected = {
	type: "boards/fetchBoards/rejected";
	payload: Error;
};

type FetchBoardPending = { type: "boards/fetchBoard/pending" };
type FetchBoardFulfilled = {
	type: "boards/fetchBoard/fulfilled";
	payload: Board;
};
type FetchBoardRejected = {
	type: "boards/fetchBoard/rejected";
	payload: Error;
};

type GetBoardUsersPending = { type: "boards/getBoardUsers/pending" };
type GetBoardUsersFulfilled = {
	type: "boards/getBoardUsers/fulfilled";
	payload: User[];
};
type GetBoardUsersRejected = {
	type: "boards/getBoardUsers/rejected";
	payload: Error;
};

type AddBoardFulfilled = { type: "boards/addBoard/fulfilled"; payload: Board };

type DeleteBoardFulfilled = {
	type: "boards/deleteBoards";
	payload: string;
};

type EditBoardFulfilled = {
	type: "boards/editBoard/fulfilled";
	payload: { boardId: string; data: Board };
};

type EditBoardRejected = {
	type: "boards/editBoard/rejected";
	payload: Error;
};

type AddColumnFulfilled = {
	type: "boards/addColumn/fulfilled";
	payload: Column;
};

type EditColumnFulfilled = {
	type: "boards/editColumn/fulfilled";
	payload: { columnId: number; column: Column };
};
type EditColumnRejected = {
	type: "boards/editColumn/rejected";
	payload: Error;
};
type DeleteColumnFulfilled = {
	type: "boards/deleteColumn/fulfilled";
	payload: { columnId: string };
};

type AddTaskFulfilled = {
	type: "boards/addTask/fulfilled";
	payload: { columnId: number; task: Task };
};

type EditTaskFulfilled = {
	type: "boards/editTask/fulfilled";
	payload: { columnId: number; task: Task };
};
type EditTaskRejected = { type: "boards/editTask/rejected"; payload: Error };
type DeleteTaskFulfilled = {
	type: "boards/deleteTask/fulfilled";
	payload: { columnId: string; taskId: string };
};

type AddLabelToCardFulfilled = {
	type: "tasks/addLabelToCard/fulfilled";
	payload: { taskId: string; labelId: number };
};

type AddLabelFulfilled = {
	type: "tasks/addLabel/fulfilled";
	payload: { boardId: number; label: Label };
};

type RemoveLabelFromCardFulfilled = {
	type: "tasks/removeLabelFromCard/fulfilled";
	payload: { taskId: string; labelId: string };
};

type BoardLimitReached = {
	type: "boards/limitReached";
	payload: LimitErrorData;
};

export const fetchBoardsPending = (): FetchBoardsPending => ({
	type: "boards/fetchBoards/pending",
});
export const fetchBoardsFulfilled = (
	payload: FetchBoardsFulfilled["payload"],
): FetchBoardsFulfilled => ({
	type: "boards/fetchBoards/fulfilled",
	payload,
});
export const fetchBoardsRejected = (error: Error): FetchBoardsRejected => ({
	type: "boards/fetchBoards/rejected",
	payload: error,
});

export const fetchBoardPending = (): FetchBoardPending => ({
	type: "boards/fetchBoard/pending",
});
export const fetchBoardFulfilled = (board: Board): FetchBoardFulfilled => ({
	type: "boards/fetchBoard/fulfilled",
	payload: board,
});
export const fetchBoardRejected = (error: Error): FetchBoardRejected => ({
	type: "boards/fetchBoard/rejected",
	payload: error,
});

export const getBoardUsersPending = (): GetBoardUsersPending => ({
	type: "boards/getBoardUsers/pending",
});
export const getBoardUsersFulfilled = (
	users: User[],
): GetBoardUsersFulfilled => ({
	type: "boards/getBoardUsers/fulfilled",
	payload: users,
});
export const getBoardUsersRejected = (error: Error): GetBoardUsersRejected => ({
	type: "boards/getBoardUsers/rejected",
	payload: error,
});

export const addBoardFulfilled = (board: Board): AddBoardFulfilled => ({
	type: "boards/addBoard/fulfilled",
	payload: board,
});

export const editBoardFulfilled = (
	boardId: string,
	data: Board,
): EditBoardFulfilled => ({
	type: "boards/editBoard/fulfilled",
	payload: { boardId, data },
});

export const editBoardRejected = (error: Error): EditBoardRejected => ({
	type: "boards/editBoard/rejected",
	payload: error,
});

export const addColumnFulfilled = (column: Column): AddColumnFulfilled => ({
	type: "boards/addColumn/fulfilled",
	payload: column,
});

export const editColumnFulfilled = (
	columnId: number,
	column: Column,
): EditColumnFulfilled => ({
	type: "boards/editColumn/fulfilled",
	payload: { columnId, column },
});
export const editColumnRejected = (error: Error): EditColumnRejected => ({
	type: "boards/editColumn/rejected",
	payload: error,
});

export const deleteColumnFulfilled = (
	columnId: string,
): DeleteColumnFulfilled => ({
	type: "boards/deleteColumn/fulfilled",
	payload: { columnId },
});

export const addTaskFulfilled = (
	columnId: number,
	task: Task,
): AddTaskFulfilled => ({
	type: "boards/addTask/fulfilled",
	payload: { columnId, task },
});

export const editTaskFulfilled = (
	columnId: number,
	task: Task,
): EditTaskFulfilled => ({
	type: "boards/editTask/fulfilled",
	payload: { columnId, task },
});
export const editTaskRejected = (error: Error): EditTaskRejected => ({
	type: "boards/editTask/rejected",
	payload: error,
});

export const deleteTaskFulfilled = (
	columnId: string,
	taskId: string,
): DeleteTaskFulfilled => ({
	type: "boards/deleteTask/fulfilled",
	payload: { columnId, taskId },
});

export const boardLimitReached = (data: LimitErrorData): BoardLimitReached => ({
	type: "boards/limitReached",
	payload: data,
});

// ─── ASSIGNEES ──────────────────────────────────────────────

type AddAssigneeFulfilled = {
	type: "cards/addAssignee/fulfilled";
	payload: { cardId: number; user: User };
};

type RemoveAssigneeFulfilled = {
	type: "cards/removeAssignee/fulfilled";
	payload: { cardId: number; userId: number };
};

// --- LABELS

export const addLabelToCardFulfilled = (
	taskId: string,
	labelId: number,
): AddLabelToCardFulfilled => ({
	type: "tasks/addLabelToCard/fulfilled",
	payload: { taskId, labelId },
});

export const addLabelFulfilled = (
	boardId: number,
	label: Label,
): AddLabelFulfilled => ({
	type: "tasks/addLabel/fulfilled",
	payload: { boardId, label },
});

export const removeLabelFromCardFulfilled = (
	taskId: string,
	labelId: string,
): RemoveLabelFromCardFulfilled => ({
	type: "tasks/removeLabelFromCard/fulfilled",
	payload: { taskId, labelId },
});

export const addAssigneeFulfilled = (
	cardId: number,
	user: User,
): AddAssigneeFulfilled => ({
	type: "cards/addAssignee/fulfilled",
	payload: { cardId, user },
});

export const removeAssigneeFulfilled = (
	cardId: number,
	userId: number,
): RemoveAssigneeFulfilled => ({
	type: "cards/removeAssignee/fulfilled",
	payload: { cardId, userId },
});

// ─── UI ──────────────────────────────────────────────
type UIResetError = {
	type: "ui/reset-error";
};

export const uiResetError = (): UIResetError => ({
	type: "ui/reset-error",
});

// ─── Thunks ─────────────────────────────
export function fetchBoards({
	page,
	limit,
}: {
	page: number;
	limit: number;
}): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const { loading, hasMore } = _getState().boards;

		// Bloquea fetch si ya está cargando o si no hay más, excepto page 1
		if (loading || (!hasMore && page !== 1)) return;
		dispatch(fetchBoardsPending());
		try {
			const { pagination, boards } = await api.boards.getBoards(page, limit);
			dispatch(fetchBoardsFulfilled({ pagination, boards }));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(fetchBoardsRejected(error));
			}
		}
	};
}

export function fetchBoard(slug: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(fetchBoardPending());
		try {
			const board = await api.boards.getBoard(slug);
			dispatch(fetchBoardFulfilled(board));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(fetchBoardRejected(error));
			}
		}
	};
}

export function getBoardUsers(id: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(getBoardUsersPending());
		try {
			const users = await api.boards.getBoardUsers(id);
			dispatch(getBoardUsersFulfilled(users));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(getBoardUsersRejected(error));
			}
		}
	};
}

export function addBoard(data: FormData): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const board = await api.boards.createBoard(data);
			dispatch(addBoardFulfilled(board));
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 403) {
				const errorData = error.response.data as LimitErrorData;

				if (errorData.errorCode === "LIMIT_BOARD_REACHED") {
					dispatch(boardLimitReached(errorData));
				}
			}
		}
	};
}

export function deleteBoard(boardId: string): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		await api.boards.deleteBoard(boardId);
		dispatch({ type: "boards/deleteBoards", payload: boardId });
	};
}

export function editBoard(
	boardId: string,
	data: FormData,
): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		try {
			const updatedBoard = await api.boards.updateBoard(boardId, data);
			dispatch(editBoardFulfilled(boardId, updatedBoard));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(editBoardRejected(error));
			}
		}
	};
}

export function shareBoard(
	boardId: string,
): AppThunk<Promise<string | undefined>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const response = await api.boards.createInvitationLink(boardId);

			const token = response.token;
			const FE_BASE_URL = globalThis.location.origin;

			let fullInvitationUrl = `${FE_BASE_URL}/invitacion?token=${token}&username=${response.inviterName}&title=${response.boardTitle}&boardId=${response.boardId}&boardSlug=${response.slug}`;

			if (response.inviterPhoto) {
				fullInvitationUrl += `&photo=${response.inviterPhoto}`;
			}

			return fullInvitationUrl;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 403) {
				const errorData = error.response.data as LimitErrorData;

				if (errorData.errorCode === "LIMIT_MEMBERS_REACHED") {
					dispatch(boardLimitReached(errorData));
				}
			}
			return undefined;
		}
	};
}

export function addColumn(
	boardId: string,
	data: Column,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const column = await api.boards.createColumn(boardId, data);
		dispatch(addColumnFulfilled(column));
	};
}

export function editColumn(
	columnId: number,
	data: Partial<Column>,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const updatedColumn = await api.boards.updateColumn(
				columnId.toString(),
				data,
			);
			dispatch(editColumnFulfilled(columnId, updatedColumn));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(editColumnRejected(error));
			}
		}
	};
}

export function removeColumn(columnId: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.deleteColumn(columnId);
		dispatch(deleteColumnFulfilled(columnId));
	};
}

export function addTask(
	columnId: number,
	data: Partial<Task>,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const task = await api.boards.createTask(columnId, data);
			dispatch(addTaskFulfilled(columnId, task));
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 403) {
				const errorData = error.response.data as LimitErrorData;

				if (errorData.errorCode === "LIMIT_TASK_REACHED") {
					dispatch(boardLimitReached(errorData));
				}
			}
		}
	};
}

export function editTask(
	columnId: number,
	taskId: string,
	data: Partial<Task> | FormData,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const updatedTask = await api.boards.updateTask(taskId, data);
			dispatch(editTaskFulfilled(columnId, updatedTask));
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 403) {
				const errorData = error.response.data as LimitErrorData;

				if (errorData.errorCode === "LIMIT_STORAGE_REACHED") {
					dispatch(boardLimitReached(errorData));
				}
			} else if (error instanceof Error) {
				dispatch(editTaskRejected(error));
			}
		}
	};
}

export function removeTask(
	columnId: string,
	taskId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.deleteTask(taskId);
		dispatch(deleteTaskFulfilled(columnId, taskId));
	};
}

export function addAssignee(
	cardId: number,
	userId: number,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const user = await api.boards.addAssignee(cardId, userId);
		dispatch(addAssigneeFulfilled(cardId, user));
	};
}

export function removeAssignee(
	cardId: number,
	userId: number,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.removeAssignee(cardId, userId);
		dispatch(removeAssigneeFulfilled(cardId, userId));
	};
}

export function addLabel(
	boardId: number,
	label: Label,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const data = await api.boards.createLabel(boardId, {
			name: label.name,
			color: label.color,
		});
		dispatch(addLabelFulfilled(boardId, data));
	};
}

export function addLabelToCard(
	taskId: string,
	labelId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const task = await api.boards.addLabelToCard(
			Number(taskId),
			Number(labelId),
		);
		if (!task) {
			return;
		}
		dispatch(addLabelToCardFulfilled(taskId, task.labelId));
	};
}

export function removeLabelFromCard(
	taskId: string,
	labelId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.removeLabelFromCard(Number(taskId), Number(labelId));
		dispatch(removeLabelFromCardFulfilled(taskId, labelId));
	};
}

//
// ─── UI ──────────────────────────────────────────────
//
type UiResetError = { type: "ui/reset-error" };
export const resetError = (): UiResetError => ({ type: "ui/reset-error" });

//
// ─── EXPORT TYPES ──────────────────────────────────────────────
//
export type Actions =
	| AuthActions
	| UserActions
	| ProfileActions
	| UpdateRemoteBoard
	| FetchBoardsPending
	| FetchBoardsFulfilled
	| FetchBoardsRejected
	| FetchBoardPending
	| FetchBoardFulfilled
	| FetchBoardRejected
	| AddBoardFulfilled
	| DeleteBoardFulfilled
	| EditBoardFulfilled
	| EditBoardRejected
	| AddColumnFulfilled
	| EditColumnFulfilled
	| EditColumnRejected
	| DeleteColumnFulfilled
	| AddTaskFulfilled
	| EditTaskFulfilled
	| EditTaskRejected
	| DeleteTaskFulfilled
	| GetBoardUsersPending
	| GetBoardUsersFulfilled
	| GetBoardUsersRejected
	| AddAssigneeFulfilled
	| RemoveAssigneeFulfilled
	| AddLabelToCardFulfilled
	| AddLabelFulfilled
	| RemoveLabelFromCardFulfilled
	| BoardLimitReached
	| UiResetError;

export type ActionsRejected =
	| AuthActionsRejected
	| UserActionsRejected
	| ProfileActionsRejected
	| FetchBoardsRejected
	| FetchBoardRejected
	| EditColumnRejected
	| EditTaskRejected
	| GetBoardUsersRejected
	| BoardLimitReached;
