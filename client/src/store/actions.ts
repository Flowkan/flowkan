import type { AppThunk } from ".";
import type { Credentials } from "../pages/login/types";
import type { Board, BoardsData } from "../pages/boards/types";
import type {
	Column as ColumnType,
	ColumnData,
	Task,
	BoardData,
} from "../pages/board/types";

type AuthLoginPending = {
	type: "auth/login/pending";
};

type AuthLoginFulfilled = {
	type: "auth/login/fulfilled";
};

type AuthLoginRejected = {
	type: "auth/login/rejected";
	payload: Error;
};

type AuthLogout = {
	type: "auth/logout";
};

type UiResetError = {
	type: "ui/reset-error";
};

type BoardsLoadPending = {
	type: "boards/load/pending";
};

type BoardsLoadFulfilled = {
	type: "boards/load/fulfilled";
	payload: Board[];
};

type BoardsLoadRejected = {
	type: "boards/load/rejected";
	payload: Error;
};

type BoardsAddPending = {
	type: "boards/add/pending";
};

type BoardsAddFulfilled = {
	type: "boards/add/fulfilled";
	payload: Board;
};

type BoardsAddRejected = {
	type: "boards/add/rejected";
	payload: Error;
};

type BoardsUpdatePending = {
	type: "boards/update/pending";
};

type BoardsUpdateFulfilled = {
	type: "boards/update/fulfilled";
	payload: Board;
};

type BoardsUpdateRejected = {
	type: "boards/update/rejected";
	payload: Error;
};

type BoardsDeletePending = {
	type: "boards/delete/pending";
};

type BoardsDeleteFulfilled = {
	type: "boards/delete/fulfilled";
	payload: string;
};

type BoardsDeleteRejected = {
	type: "boards/delete/rejected";
	payload: Error;
};

type BoardLoadPending = {
	type: "board/load/pending";
};
type BoardLoadFulfilled = {
	type: "board/load/fulfilled";
	payload: BoardData;
};
type BoardLoadRejected = {
	type: "board/load/rejected";
	payload: Error;
};

type ColumnAddPending = {
	type: "column/add/pending";
};
type ColumnAddFulfilled = {
	type: "column/add/fulfilled";
	payload: ColumnType;
};
type ColumnAddRejected = {
	type: "column/add/rejected";
	payload: Error;
};

type ColumnUpdatePending = {
	type: "column/update/pending";
};
type ColumnUpdateFulfilled = {
	type: "column/update/fulfilled";
	payload: ColumnType;
};
type ColumnUpdateRejected = {
	type: "column/update/rejected";
	payload: Error;
};

type ColumnDeletePending = {
	type: "column/delete/pending";
};
type ColumnDeleteFulfilled = {
	type: "column/delete/fulfilled";
	payload: string;
};
type ColumnDeleteRejected = {
	type: "column/delete/rejected";
	payload: Error;
};

type TaskAddPending = {
	type: "task/add/pending";
};
type TaskAddFulfilled = {
	type: "task/add/fulfilled";
	payload: { columnId: string; task: Task };
};
type TaskAddRejected = {
	type: "task/add/rejected";
	payload: Error;
};

type TaskUpdatePending = {
	type: "task/update/pending";
};
type TaskUpdateFulfilled = {
	type: "task/update/fulfilled";
	payload: { columnId: string; task: Task };
};
type TaskUpdateRejected = {
	type: "task/update/rejected";
	payload: Error;
};

type TaskDeletePending = {
	type: "task/delete/pending";
};
type TaskDeleteFulfilled = {
	type: "task/delete/fulfilled";
	payload: { columnId: string; taskId: string };
};
type TaskUDeleteRejected = {
	type: "task/delete/rejected";
	payload: Error;
};

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

export const boardsLoadPending = (): BoardsLoadPending => ({
	type: "boards/load/pending",
});

export const boardsLoadFulfilled = (boards: Board[]): BoardsLoadFulfilled => ({
	type: "boards/load/fulfilled",
	payload: boards,
});

export const boardsLoadRejected = (error: Error): BoardsLoadRejected => ({
	type: "boards/load/rejected",
	payload: error,
});

export const boardsAddPending = (): BoardsAddPending => ({
	type: "boards/add/pending",
});
export const boardsAddFulfilled = (newBoard: Board): BoardsAddFulfilled => ({
	type: "boards/add/fulfilled",
	payload: newBoard,
});
export const boardsAddRejected = (error: Error): BoardsAddRejected => ({
	type: "boards/add/rejected",
	payload: error,
});

export const boardsUpdatePending = (): BoardsUpdatePending => ({
	type: "boards/update/pending",
});
export const boardsUpdateFulfilled = (
	updatedBoard: Board,
): BoardsUpdateFulfilled => ({
	type: "boards/update/fulfilled",
	payload: updatedBoard,
});
export const boardsUpdateRejected = (error: Error): BoardsUpdateRejected => ({
	type: "boards/update/rejected",
	payload: error,
});

export const boardsDeletePending = (): BoardsDeletePending => ({
	type: "boards/delete/pending",
});
export const boardsDeleteFulfilled = (
	boardId: string,
): BoardsDeleteFulfilled => ({
	type: "boards/delete/fulfilled",
	payload: boardId,
});
export const boardsDeleteRejected = (error: Error): BoardsDeleteRejected => ({
	type: "boards/delete/rejected",
	payload: error,
});

export const boardLoadPending = (): BoardLoadPending => ({
	type: "board/load/pending",
});
export const boardLoadFulfilled = (board: BoardData): BoardLoadFulfilled => ({
	type: "board/load/fulfilled",
	payload: board,
});
export const boardLoadRejected = (error: Error): BoardLoadRejected => ({
	type: "board/load/rejected",
	payload: error,
});

export const columnAddPending = (): ColumnAddPending => ({
	type: "column/add/pending",
});
export const columnAddFulfilled = (column: ColumnType): ColumnAddFulfilled => ({
	type: "column/add/fulfilled",
	payload: column,
});
export const columnAddRejected = (error: Error): ColumnAddRejected => ({
	type: "column/add/rejected",
	payload: error,
});

export const columnUpdatePending = (): ColumnUpdatePending => ({
	type: "column/update/pending",
});
export const columnUpdateFulfilled = (
	column: ColumnType,
): ColumnUpdateFulfilled => ({
	type: "column/update/fulfilled",
	payload: column,
});
export const columnUpdateRejected = (error: Error): ColumnUpdateRejected => ({
	type: "column/update/rejected",
	payload: error,
});

export const columnDeletePending = (): ColumnDeletePending => ({
	type: "column/delete/pending",
});
export const columnDeleteFulfilled = (
	columnId: string,
): ColumnDeleteFulfilled => ({
	type: "column/delete/fulfilled",
	payload: columnId,
});
export const columnDeleteRejected = (error: Error): ColumnDeleteRejected => ({
	type: "column/delete/rejected",
	payload: error,
});

export const taskAddPending = (): TaskAddPending => ({
	type: "task/add/pending",
});
export const taskAddFulfilled = (
	columnId: string,
	task: Task,
): TaskAddFulfilled => ({
	type: "task/add/fulfilled",
	payload: { columnId, task },
});
export const taskAddRejected = (error: Error): TaskAddRejected => ({
	type: "task/add/rejected",
	payload: error,
});

export const taskUpdatePending = (): TaskUpdatePending => ({
	type: "task/update/pending",
});
export const taskUpdateFulfilled = (
	columnId: string,
	task: Task,
): TaskUpdateFulfilled => ({
	type: "task/update/fulfilled",
	payload: { columnId, task },
});
export const taskUpdateRejected = (error: Error): TaskUpdateRejected => ({
	type: "task/update/rejected",
	payload: error,
});

export const taskDeletePending = (): TaskDeletePending => ({
	type: "task/delete/pending",
});
export const taskDeleteFulfilled = (
	columnId: string,
	taskId: string,
): TaskDeleteFulfilled => ({
	type: "task/delete/fulfilled",
	payload: { columnId, taskId },
});
export const taskDeleteRejected = (error: Error): TaskUDeleteRejected => ({
	type: "task/delete/rejected",
	payload: error,
});

export function authLogin(credentials: Credentials): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api, router }) {
		dispatch(authLoginPending());
		try {
			await api.auth.login(credentials);
			dispatch(authLoginFulfilled());
			const to = router.state.location.state?.from ?? "/";
			router.navigate(to, { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function authLogout(): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		await api.auth.logout();
		dispatch({ type: "auth/logout" });
	};
}

export function boardsLoad(): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		dispatch(boardsLoadPending());
		try {
			const boards = await api.boards.getBoards();
			dispatch(boardsLoadFulfilled(boards));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsLoadRejected(error));
			}
		}
	};
}

export const boardsAdd =
	(boardData: BoardsData): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsAddPending());
		try {
			const newBoard = await api.boards.createBoard(boardData);
			dispatch(boardsAddFulfilled(newBoard));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsAddRejected(error));
			}
		}
	};

export const boardsUpdate =
	(boardId: string, boardData: BoardsData): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsUpdatePending());
		try {
			const updatedBoard = await api.boards.updateBoard(boardId, boardData);
			dispatch(boardsUpdateFulfilled(updatedBoard));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsUpdateRejected(error));
			}
		}
	};

export const boardsDelete =
	(boardId: string): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsDeletePending());
		try {
			await api.boards.deleteBoard(boardId);
			dispatch(boardsDeleteFulfilled(boardId));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsDeleteRejected(error));
			}
		}
	};

export const boardUpdateOrder = (
	columnOrder?: string[],
	columns?: { [key: string]: ColumnType },
) => ({
	type: "board/update/order",
	payload: { columnOrder, columns },
});

export const boardLoad =
	(boardId: string): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardLoadPending());
		try {
			const boardData = await api.board.getBoard(boardId);
			dispatch(boardLoadFulfilled(boardData));
		} catch (error) {
			dispatch(
				boardLoadRejected(
					error instanceof Error ? error : new Error("Failed to load board."),
				),
			);
		}
	};

export const columnAdd =
	(columnData: ColumnData): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		try {
			dispatch(columnAddPending());
			const newColumn = await api.board.createColumn(columnData);
			dispatch(columnAddFulfilled(newColumn));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(columnAddRejected(error));
			}
		}
	};

export const columnUpdate =
	(columnId: string, title: string): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		try {
			dispatch(columnUpdatePending());
			const updatedColumn = await api.board.updateColumn(columnId, {
				title,
			});
			dispatch(columnUpdateFulfilled(updatedColumn));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(columnUpdateRejected(error));
			}
		}
	};

export const columnDelete =
	(columnId: string): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		try {
			dispatch(columnDeletePending());
			await api.board.deleteColumn(columnId);
			dispatch(columnDeleteFulfilled(columnId));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(columnDeleteRejected(error));
			}
		}
	};

export const taskAdd =
	(columnId: string, task: Task): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		try {
			dispatch(taskAddPending());
			const newTask = await api.board.createTask(task);
			dispatch(taskAddFulfilled(columnId, newTask));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(taskAddRejected(error));
			}
		}
	};

export const taskUpdate =
	(taskId: string, data: Partial<Task>): AppThunk<Promise<void>> =>
	async (dispatch, getState, { api }) => {
		try {
			dispatch(taskUpdatePending());
			const updatedTask = await api.board.updateTask(taskId, data);
			const state = getState();
			const columnId = findColumnIdByTaskId(state.currentBoard.data, taskId);
			if (columnId) {
				dispatch(taskUpdateFulfilled(columnId, updatedTask));
			}
		} catch (error) {
			if (error instanceof Error) {
				dispatch(taskUpdateRejected(error));
			}
		}
	};

export const taskDelete =
	(taskId: string): AppThunk<Promise<void>> =>
	async (dispatch, getState, { api }) => {
		try {
			dispatch(taskDeletePending());
			await api.board.deleteTask(taskId);
			const state = getState();
			const columnId = findColumnIdByTaskId(state.currentBoard.data, taskId);
			if (columnId) {
				dispatch(taskDeleteFulfilled(columnId, taskId));
			}
		} catch (error) {
			if (error instanceof Error) {
				dispatch(taskDeleteRejected(error));
			}
		}
	};

const findColumnIdByTaskId = (
	boardData: BoardData | null,
	taskId: string,
): string | null => {
	if (!boardData) return null;
	for (const columnId in boardData.columns) {
		if (boardData.columns[columnId].items.some((task) => task.id === taskId)) {
			return columnId;
		}
	}
	return null;
};

export const resetError = (): UiResetError => ({
	type: "ui/reset-error",
});

export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogout
	| UiResetError
	| BoardsLoadPending
	| BoardsLoadFulfilled
	| BoardsLoadRejected
	| BoardsAddPending
	| BoardsAddFulfilled
	| BoardsAddRejected
	| BoardsUpdatePending
	| BoardsUpdateFulfilled
	| BoardsUpdateRejected
	| BoardsDeletePending
	| BoardsDeleteFulfilled
	| BoardsDeleteRejected
	| BoardLoadPending
	| BoardLoadFulfilled
	| BoardLoadRejected
	| ColumnAddPending
	| ColumnAddFulfilled
	| ColumnAddRejected
	| ColumnUpdatePending
	| ColumnUpdateFulfilled
	| ColumnUpdateRejected
	| ColumnDeletePending
	| ColumnDeleteFulfilled
	| ColumnDeleteRejected
	| TaskAddPending
	| TaskAddFulfilled
	| TaskAddRejected
	| TaskUpdatePending
	| TaskUpdateFulfilled
	| TaskUpdateRejected
	| TaskDeletePending
	| TaskDeleteFulfilled
	| TaskUDeleteRejected;

export type ActionsRejected =
	| AuthLoginRejected
	| BoardsLoadRejected
	| BoardsAddRejected
	| BoardsUpdateRejected
	| BoardsDeleteRejected
	| BoardLoadRejected
	| ColumnAddRejected
	| ColumnUpdateRejected
	| ColumnDeleteRejected
	| TaskAddRejected
	| TaskUpdateRejected
	| TaskUDeleteRejected;
