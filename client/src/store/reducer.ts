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
	state = defaultState.auth,
	action: Actions,
): State["auth"] {
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
