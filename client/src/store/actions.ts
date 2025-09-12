import type { AppThunk } from ".";
import type { Credentials } from "../pages/login/types";
import type { Board, BoardsData, Column, Task } from "../pages/boards/types";

//
// ─── AUTH ──────────────────────────────────────────────
//
type AuthLoginPending = { type: "auth/login/pending" };
type AuthLoginFulfilled = { type: "auth/login/fulfilled" };
type AuthLoginRejected = { type: "auth/login/rejected"; payload: Error };
type AuthLogout = { type: "auth/logout" };

export const authLoginPending = (): AuthLoginPending => ({
	type: "auth/login/pending",
});
export const authLoginFulfilled = (): AuthLoginFulfilled => ({
	type: "auth/login/fulfilled",
});
export const authLoginRejected = (error: Error): AuthLoginRejected => ({
	type: "auth/login/rejected",
	payload: error,
});
export const authLogout = (): AuthLogout => ({ type: "auth/logout" });

export function login(credentials: Credentials): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		dispatch(authLoginPending());
		try {
			await api.auth.login(credentials);
			dispatch(authLoginFulfilled());
			const to = router.state.location.state?.from ?? "/boards";
			router.navigate(to, { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function logout(): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.auth.logout();
		dispatch(authLogout());
	};
}

//
// ─── BOARDS ──────────────────────────────────────────────
//
type FetchBoardsPending = { type: "boards/fetchBoards/pending" };
type FetchBoardsFulfilled = {
	type: "boards/fetchBoards/fulfilled";
	payload: Board[];
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

type AddBoardFulfilled = { type: "boards/addBoard/fulfilled"; payload: Board };

type DeleteBoardFulfilled = {
	type: "boards/deleteBoards";
	payload: string;
};

type EditBoardFulfilled = {
	type: "boards/editBoard/fulfilled";
	payload: { boardId: string; data: BoardsData };
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

export const fetchBoardsPending = (): FetchBoardsPending => ({
	type: "boards/fetchBoards/pending",
});
export const fetchBoardsFulfilled = (
	boards: Board[],
): FetchBoardsFulfilled => ({
	type: "boards/fetchBoards/fulfilled",
	payload: boards,
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

export const addBoardFulfilled = (board: Board): AddBoardFulfilled => ({
	type: "boards/addBoard/fulfilled",
	payload: board,
});

export const editBoardFulfilled = (
	boardId: string,
	data: BoardsData,
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

// ─── Thunks ─────────────────────────────
export function fetchBoards(): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(fetchBoardsPending());
		try {
			const boards = await api.boards.getBoards();
			dispatch(fetchBoardsFulfilled(boards));
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

export function addBoard(data: BoardsData): AppThunk<Promise<void>> {
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
	data: BoardsData,
): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		try {
			await api.boards.updateBoard(boardId, data);
			dispatch(editBoardFulfilled(boardId, data));
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
	data: Partial<Task>,
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

//
// ─── UI ──────────────────────────────────────────────
//
type UiResetError = { type: "ui/reset-error" };
export const resetError = (): UiResetError => ({ type: "ui/reset-error" });

//
// ─── EXPORT TYPES ──────────────────────────────────────────────
//
export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogout
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
	| UiResetError;

export type ActionsRejected =
	| AuthLoginRejected
	| FetchBoardsRejected
	| FetchBoardRejected
	| EditColumnRejected
	| EditTaskRejected;
