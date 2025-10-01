import type { AppThunk } from "..";
import type { User } from "../../pages/login/types";
import type { Board, Column, Label, Task } from "../../pages/boards/types";
import type { DropResult } from "@hello-pangea/dnd";
import type { AuthActions, AuthActionsRejected } from "../auth/actions";
import type {
	ProfileActions,
	ProfileActionsRejected,
	UserActions,
	UserActionsRejected,
} from "../profile/actions";

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

type AddLabelFulfilled = {
	type: "tasks/addLabel/fulfilled";
	payload: { taskId: string; label: Label };
};

type RemoveLabelFulfilled = {
	type: "tasks/removeLabel/fulfilled";
	payload: { taskId: string; labelId: string };
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

// ─── ASSIGNEES ──────────────────────────────────────────────

type AddAssigneeFulfilled = {
	type: "cards/addAssignee/fulfilled";
	payload: { cardId: number; user: User };
};

type RemoveAssigneeFulfilled = {
	type: "cards/removeAssignee/fulfilled";
	payload: { cardId: number; userId: number };
};

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

// --- LABELS

export const addLabelFulfilled = (
	taskId: string,
	label: Label,
): AddLabelFulfilled => ({
	type: "tasks/addLabel/fulfilled",
	payload: { taskId, label },
});

export const removeLabelFulfilled = (
	taskId: string,
	labelId: string,
): RemoveLabelFulfilled => ({
	type: "tasks/removeLabel/fulfilled",
	payload: { taskId, labelId },
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

export function fetchBoard(id: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(fetchBoardPending());
		try {
			const board = await api.boards.getBoard(id);
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
		const board = await api.boards.createBoard(data);
		dispatch(addBoardFulfilled(board));
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
		const task = await api.boards.createTask(columnId, data);
		dispatch(addTaskFulfilled(columnId, task));
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
			if (error instanceof Error) {
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
	taskId: string,
	labelId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const task = await api.boards.addLabelToCard(
			Number(taskId),
			Number(labelId),
		);
		const label = task.labels.find((l) => l.id === Number(labelId))!;
		dispatch(addLabelFulfilled(taskId, label));
	};
}

export function removeLabel(
	taskId: string,
	labelId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.removeLabelFromCard(Number(taskId), Number(labelId));
		dispatch(removeLabelFulfilled(taskId, labelId));
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
	| AddLabelFulfilled
	| RemoveLabelFulfilled
	| UiResetError;

export type ActionsRejected =
	| AuthActionsRejected
	| UserActionsRejected
	| ProfileActionsRejected
	| FetchBoardsRejected
	| FetchBoardRejected
	| EditColumnRejected
	| EditTaskRejected
	| GetBoardUsersRejected;
