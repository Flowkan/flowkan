import type { AppThunk } from ".";
import type { Credentials } from "../pages/login/types";

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

export const resetError = (): UiResetError => ({
	type: "ui/reset-error",
});

export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogout
	| UiResetError;

export type ActionsRejected = AuthLoginRejected;
