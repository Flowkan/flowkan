import { combineReducers } from "redux";
import type { BoardData } from "../types";
import { type Actions, type ActionsRejected } from "./actions.ts";

export type AuthState = boolean;

export type BoardsState = {
	loaded: boolean;
	data: BoardData | null;
};

export type UiState = {
	pending: boolean;
	error: Error | null;
};

export type State = {
	auth: AuthState;
	boards: BoardsState;
	ui: UiState;
};

const defaultState: State = {
	auth: false,
	boards: {
		loaded: false,
		data: null,
	},
	ui: {
		pending: false,
		error: null,
	},
};

export function auth(
	state: AuthState = defaultState.auth,
	action: Actions,
): AuthState {
	switch (action.type) {
		case "auth/login/fulfilled":
			return true;
		case "auth/logout":
			return false;
		default:
			return state;
	}
}

export function boards(
	state: BoardsState = defaultState.boards,
	action: Actions,
): BoardsState {
	switch (action.type) {
		case "boards/loaded/fulfilled":
			return { loaded: true, data: action.payload };

		case "column/created/fulfilled":
			if (!state.data) return state;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[action.payload.id]: action.payload,
					},
					columnOrder: [...state.data.columnOrder, action.payload.id],
				},
			};

		case "column/deleted":
			if (!state.data) return state;
			const newColumns = { ...state.data.columns };
			delete newColumns[action.payload];
			const newColumnOrder = state.data.columnOrder.filter(
				(id) => id !== action.payload,
			);
			return {
				...state,
				data: {
					...state.data,
					columns: newColumns,
					columnOrder: newColumnOrder,
				},
			};

		case "column/titleEdited":
			if (!state.data) return state;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[action.payload.columnId]: {
							...state.data.columns[action.payload.columnId],
							title: action.payload.newTitle,
						},
					},
				},
			};

		case "task/created/fulfilled":
			if (!state.data) return state;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[action.payload.columnId]: {
							...state.data.columns[action.payload.columnId],
							items: [
								...state.data.columns[action.payload.columnId].items,
								action.payload.task,
							],
						},
					},
				},
			};

		case "task/edited/fulfilled":
			if (!state.data) return state;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[action.payload.columnId]: {
							...state.data.columns[action.payload.columnId],
							items: state.data.columns[action.payload.columnId].items.map(
								(task) =>
									task.id === action.payload.taskId
										? {
												...task,
												content: action.payload.newContent,
												description:
													action.payload.newDescription !== undefined
														? action.payload.newDescription
														: task.description,
											}
										: task,
							),
						},
					},
				},
			};

		case "task/deleted":
			if (!state.data) return state;
			return {
				...state,
				data: {
					...state.data,
					columns: {
						...state.data.columns,
						[action.payload.columnId]: {
							...state.data.columns[action.payload.columnId],
							items: state.data.columns[action.payload.columnId].items.filter(
								(task) => task.id !== action.payload.taskId,
							),
						},
					},
				},
			};

		case "board/reordered":
			return { ...state, data: action.payload };

		default:
			return state;
	}
}

function isRejectedAction(action: Actions): action is ActionsRejected {
	return action.type.endsWith("/rejected");
}

export function ui(state: UiState = defaultState.ui, action: Actions): UiState {
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

const rootReducer = combineReducers({
	auth,
	boards,
	ui,
});

export default rootReducer;
