import type { AppThunk } from ".";
import type { Credentials } from "../pages/login/types";
import type { Board } from "../pages/boards/types";

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
	| BoardsLoadRejected;

export type ActionsRejected = AuthLoginRejected | BoardsLoadRejected;
