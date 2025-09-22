import type { AuthState } from "../types/defaultStates";
import type { AuthActions } from "./actions";

//
// ─── AUTH REDUCER ──────────────────────────────────────────────
//

const storedUser = localStorage.getItem("user");
const defaultState: AuthState = {
	auth: {
		isAuthenticated: false,
		error: null,
		user: storedUser ? JSON.parse(storedUser) : null,
	},
	ui: { pending: false, error: null },
};

export function authReducer(
	state: AuthState["auth"] = defaultState.auth,
	action: AuthActions,
): AuthState["auth"] {
	switch (action.type) {
		case "auth/login/pending":
			return { ...state, error: null, isAuthenticated: false, user: null };
		case "auth/login/fulfilled":
			return { ...state, isAuthenticated: true, user: action.payload };
		case "auth/login/rejected":
			return {
				...state,
				error: action.payload.message,
				isAuthenticated: false,
				user: null,
			};
		case "auth/logout/pending":
			return { ...state, error: null, isAuthenticated: true, user: state.user };

		case "auth/logout/fulfilled":
			return { ...state, isAuthenticated: false, user: null };

		case "auth/logout/rejected":
			return {
				...state,
				error: action.payload.message,
				isAuthenticated: true,
				user: state.user,
			};
		case "user/update/pending":
		case "user/update/rejected":
			return state;
		case "user/update/fulfilled":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
}
