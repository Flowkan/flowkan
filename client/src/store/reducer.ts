import { type Actions, type ActionsRejected } from "./actions.ts";
import type { Board } from "../pages/boards/types";

export type State = {
	auth: boolean;
	boards: {
		loaded: boolean;
		data: Board[] | null;
		pending: boolean;
		error: Error | null;
	};
	ui: {
		pending: boolean;
		error: Error | null;
	};
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
		data: null,
		pending: false,
		error: null,
	},
	ui: {
		pending: false,
		error: null,
	},
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
