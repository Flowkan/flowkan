import { type Actions, type ActionsRejected } from "./actions.ts";
import type { Board } from "../pages/boards/types";
import type { BoardData } from "../pages/board/types";
import { combineReducers } from "redux";

export type State = {
	auth: boolean;
	boards: {
		loaded: boolean;
		data: Board[];
		pending: boolean;
		error: Error | null;
	};
	ui: {
		pending: boolean;
		error: Error | null;
	};
	currentBoard: CurrentBoardState;
};

export type AuthState = {
	isLogged: boolean;
	user?: {
		id: number;
		name: string;
		email: string;
		photo?: string;
	};
};

const defaultAuthState: AuthState = {
	isLogged: false,
	user: undefined,
};

const defaultState: State = {
	auth: false,
	boards: {
		loaded: false,
		data: [],
		pending: false,
		error: null,
	},
	ui: {
		pending: false,
		error: null,
	},
	currentBoard: {
		data: null,
		pending: false,
		error: null,
	},
};

export type CurrentBoardState = {
	data: BoardData | null;
	pending: boolean;
	error: Error | null;
};

const defaultCurrentBoardState: CurrentBoardState = {
	data: null,
	pending: false,
	error: null,
};

export function auth(
	state: AuthState = defaultAuthState,
	action: Actions,
): AuthState {
	switch (action.type) {
		case "auth/login/fulfilled":
			return {
				isLogged: true,
				user: action.payload,
			};
		case "auth/logout":
			return defaultAuthState;
		default:
			return state;
	}
}

export function boards(
	state = defaultState.boards,
	action: Actions,
): State["boards"] {
	switch (action.type) {
		case "boards/load/pending":
			return { ...state, pending: true, error: null };
		case "boards/load/fulfilled":
			return { ...state, loaded: true, data: action.payload, pending: false };
		case "boards/load/rejected":
			return { ...state, error: action.payload, pending: false };
		case "boards/add/pending":
			return { ...state, pending: true, error: null };
		case "boards/add/fulfilled":
			return {
				...state,
				data: state.data ? [...state.data, action.payload] : [action.payload],
				pending: false,
			};
		case "boards/add/rejected":
			return { ...state, error: action.payload, pending: false };

		case "boards/update/pending":
			return { ...state, pending: true, error: null };
		case "boards/update/fulfilled":
			return {
				...state,
				data: state.data
					? state.data.map((board) =>
							board.id === action.payload.id ? action.payload : board,
						)
					: state.data,
				pending: false,
			};
		case "boards/update/rejected":
			return { ...state, error: action.payload, pending: false };

		case "boards/delete/pending":
			return { ...state, pending: true, error: null };
		case "boards/delete/fulfilled":
			return {
				...state,
				data: state.data
					? state.data.filter((board) => board.id !== action.payload)
					: state.data,
				pending: false,
			};
		case "boards/delete/rejected":
			return { ...state, error: action.payload, pending: false };
		default:
			return state;
	}
}

export function currentBoard(
	state = defaultCurrentBoardState,
	action: Actions,
): CurrentBoardState {
	switch (action.type) {
		case "board/load/pending":
		case "column/add/pending":
		case "column/update/pending":
		case "column/delete/pending":
		case "task/add/pending":
		case "task/update/pending":
		case "task/delete/pending":
			return { ...state, pending: true, error: null };
		case "board/load/fulfilled":
			return {
				...state,
				data: {
					...action.payload,
					columns: action.payload.columns ?? {},
					columnOrder: action.payload.columnOrder ?? [],
				},
				pending: false,
				error: null,
			};
		case "column/add/fulfilled": {
			if (!state.data) return state;
			const newColumn = action.payload;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[newColumn.id]: newColumn,
					},
					columnOrder: [...state.data.columnOrder, newColumn.id],
				},
				pending: false,
				error: null,
			};
		}
		case "column/update/fulfilled": {
			if (!state.data) return state;
			const updatedColumn = action.payload;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[updatedColumn.id]: updatedColumn,
					},
				},
				pending: false,
				error: null,
			};
		}
		case "column/delete/fulfilled": {
			if (!state.data) return state;
			const columnIdToDelete = action.payload;
			const newColumns = { ...state.data.columns };
			delete newColumns[columnIdToDelete];
			return {
				...state,
				data: {
					...state.data,
					columns: newColumns,
					columnOrder: state.data.columnOrder.filter(
						(id) => id !== columnIdToDelete,
					),
				},
				pending: false,
				error: null,
			};
		}
		case "task/add/fulfilled": {
			if (!state.data) return state;
			const { columnId: addColumnId, task: newTask } = action.payload;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[addColumnId]: {
							...state.data.columns[addColumnId],
							items: [...state.data.columns[addColumnId].items, newTask],
						},
					},
				},
				pending: false,
				error: null,
			};
		}
		case "task/update/fulfilled": {
			if (!state.data) return state;
			const { columnId: updateColumnId, task: updatedTask } = action.payload;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[updateColumnId]: {
							...state.data.columns[updateColumnId],
							items: state.data.columns[updateColumnId].items.map((task) =>
								task.id === updatedTask.id ? updatedTask : task,
							),
						},
					},
				},
				pending: false,
				error: null,
			};
		}
		case "task/delete/fulfilled": {
			if (!state.data) return state;
			const { columnId: deleteColumnId, taskId: taskToDeleteId } =
				action.payload;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[deleteColumnId]: {
							...state.data.columns[deleteColumnId],
							items: state.data.columns[deleteColumnId].items.filter(
								(task) => task.id !== taskToDeleteId,
							),
						},
					},
				},
				pending: false,
				error: null,
			};
		}
		case "board/load/rejected":
		case "column/add/rejected":
		case "column/update/rejected":
		case "column/delete/rejected":
		case "task/add/rejected":
		case "task/update/rejected":
		case "task/delete/rejected":
			return { ...state, error: action.payload, pending: false };
		default:
			return state;
	}
}

function isRejectedAction(action: Actions): action is ActionsRejected {
	return action.type.endsWith("/rejected");
}

export function ui(state = defaultState.ui, action: Actions): State["ui"] {
	if (action.type === "auth/login/pending") {
		return { pending: true, error: null };
	}
	if (action.type === "auth/login/fulfilled") {
		return { pending: false, error: null };
	}

	if (isRejectedAction(action)) {
		return { pending: false, error: action.payload };
	}
	if (action.type === "ui/reset-error") {
		return { ...state, error: null };
	}
	return state;
}

export const rootReducer = combineReducers({
	auth,
	boards,
	ui,
	currentBoard,
});

export type RootState = ReturnType<typeof rootReducer>;
