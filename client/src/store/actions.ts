import type { AppThunk } from ".";
import type { BoardData, Column, Task } from "../types";

export type Credentials = {
	username?: string;
	password?: string;
};

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

type BoardsLoadedFulfilled = {
	type: "boards/loaded/fulfilled";
	payload: BoardData;
};

type ColumnCreatedFulfilled = {
	type: "column/created/fulfilled";
	payload: Column;
};

type ColumnDeleted = {
	type: "column/deleted";
	payload: string;
};

type ColumnTitleEdited = {
	type: "column/titleEdited";
	payload: { columnId: string; newTitle: string };
};

type TaskCreatedFulfilled = {
	type: "task/created/fulfilled";
	payload: { columnId: string; task: Task };
};

type TaskEditedFulfilled = {
	type: "task/edited/fulfilled";
	payload: {
		columnId: string;
		taskId: string;
		newContent: string;
		newDescription?: string;
	};
};

type TaskDeleted = {
	type: "task/deleted";
	payload: { columnId: string; taskId: string };
};

type BoardReordered = {
	type: "board/reordered";
	payload: BoardData;
};

type UiResetError = {
	type: "ui/reset-error";
};

type BoardsLoadRejected = {
	type: "boards/load/rejected";
	payload: Error;
};

type ColumnCreateRejected = {
	type: "column/create/rejected";
	payload: Error;
};

type TaskCreateRejected = {
	type: "task/create/rejected";
	payload: Error;
};

export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogout
	| BoardsLoadedFulfilled
	| ColumnCreatedFulfilled
	| ColumnDeleted
	| ColumnTitleEdited
	| TaskCreatedFulfilled
	| TaskEditedFulfilled
	| TaskDeleted
	| BoardReordered
	| UiResetError
	| BoardsLoadRejected
	| ColumnCreateRejected
	| TaskCreateRejected;

export type ActionsRejected =
	| AuthLoginRejected
	| BoardsLoadRejected
	| ColumnCreateRejected
	| TaskCreateRejected;

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

export function authLogin(credentials: Credentials): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api, router }) {
		dispatch(authLoginPending());
		try {
			await new Promise((resolve) => setTimeout(resolve, 500)); // Simula una llamada a la API
			if (credentials.username === "user" && credentials.password === "pass") {
				dispatch(authLoginFulfilled());
				const to = router.state.location.state?.from ?? "/";
				router.navigate(to, { replace: true });
			} else {
				throw new Error("Credenciales inválidas");
			}
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function authLogout(): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api, router }) {
		await new Promise((resolve) => setTimeout(resolve, 200)); // Simula una llamada a la API
		dispatch({ type: "auth/logout" });
		const to = router.state.location.state?.from ?? "/login";
		router.navigate(to, { replace: true });
	};
}

export const boardsLoadedFulfilled = (
	boardData: BoardData,
): BoardsLoadedFulfilled => ({
	type: "boards/loaded/fulfilled",
	payload: boardData,
});

export const columnCreatedFulfilled = (
	column: Column,
): ColumnCreatedFulfilled => ({
	type: "column/created/fulfilled",
	payload: column,
});

export const columnDeleted = (columnId: string): ColumnDeleted => ({
	type: "column/deleted",
	payload: columnId,
});

export const columnTitleEdited = (
	columnId: string,
	newTitle: string,
): ColumnTitleEdited => ({
	type: "column/titleEdited",
	payload: { columnId, newTitle },
});

export const taskCreatedFulfilled = (
	columnId: string,
	task: Task,
): TaskCreatedFulfilled => ({
	type: "task/created/fulfilled",
	payload: { columnId, task },
});

export const taskEditedFulfilled = (
	columnId: string,
	taskId: string,
	newContent: string,
	newDescription?: string,
): TaskEditedFulfilled => ({
	type: "task/edited/fulfilled",
	payload: { columnId, taskId, newContent, newDescription },
});

export const taskDeleted = (columnId: string, taskId: string): TaskDeleted => ({
	type: "task/deleted",
	payload: { columnId, taskId },
});

export const boardReordered = (boardData: BoardData): BoardReordered => ({
	type: "board/reordered",
	payload: boardData,
});

export const resetError = (): UiResetError => ({
	type: "ui/reset-error",
});

// --- Thunks (simulando interacciones con API o lógica compleja) ---
// Usaremos "generateUniqueId" del componente Boards para simular IDs por ahora.
const generateUniqueId = (): string => {
	return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

export function loadInitialBoard(): AppThunk<Promise<void>> {
	return async function (dispatch, getState) {
		const state = getState();
		if (state.boards.loaded) return;

		try {
			// Simula una llamada a la API para obtener el tablero inicial
			// Usaremos un mock de BoardData
			const initialBoardData: BoardData = {
				columns: {
					"col-1": {
						id: "col-1",
						title: "Por hacer",
						items: [
							{
								id: generateUniqueId(),
								content: "Comprar ingredientes para la cena",
								description: "Revisar lista de supermercado.",
							},
							{ id: generateUniqueId(), content: "Revisar pull requests" },
						],
					},
					"col-2": {
						id: "col-2",
						title: "En progreso",
						items: [{ id: generateUniqueId(), content: "Diseñar wireframes" }],
					},
				},
				columnOrder: ["col-1", "col-2"],
			};
			// Aquí iría tu api.boards.getBoard()
			dispatch(boardsLoadedFulfilled(initialBoardData));
		} catch (error) {
			if (error instanceof Error) {
				dispatch({ type: "boards/load/rejected", payload: error });
			}
		}
	};
}

export function createColumn(title: string): AppThunk<Promise<void>> {
	return async function (dispatch) {
		try {
			const newColumnId = generateUniqueId();
			const newColumn: Column = {
				id: newColumnId,
				title: title,
				items: [],
			};
			// Aquí iría tu api.columns.create(newColumn)
			dispatch(columnCreatedFulfilled(newColumn));
		} catch (error) {
			if (error instanceof Error) {
				dispatch({ type: "column/create/rejected", payload: error });
			}
		}
	};
}

export function createTask(
	columnId: string,
	content: string,
): AppThunk<Promise<void>> {
	return async function (dispatch) {
		try {
			const newTaskId = generateUniqueId();
			const newTask: Task = { id: newTaskId, content };
			// Aquí iría tu api.tasks.create(columnId, newTask)
			dispatch(taskCreatedFulfilled(columnId, newTask));
		} catch (error) {
			if (error instanceof Error) {
				dispatch({ type: "task/create/rejected", payload: error });
			}
		}
	};
}

export function editTask(
	columnId: string,
	taskId: string,
	newContent: string,
	newDescription?: string,
): AppThunk<Promise<void>> {
	return async function (dispatch) {
		try {
			// Aquí iría tu api.tasks.update(taskId, { newContent, newDescription })
			dispatch(
				taskEditedFulfilled(columnId, taskId, newContent, newDescription),
			);
		} catch (error) {
			// Manejo de errores
		}
	};
}
