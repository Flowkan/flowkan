import type { AppThunk } from "..";
import {
	removeAuthorizationHeader,
	setAuthorizationHeader,
} from "../../api/client";
import type { Credentials, User } from "../../pages/login/types";

//
// ─── AUTH ──────────────────────────────────────────────
//
type AuthLoginPending = { type: "auth/login/pending" };
type AuthLoginFulfilled = { type: "auth/login/fulfilled"; payload: User };
type AuthLoginRejected = { type: "auth/login/rejected"; payload: Error };
type AuthLogoutPending = { type: "auth/logout/pending" };
type AuthLogoutFulfilled = { type: "auth/logout/fulfilled" };
type AuthLogoutRejected = { type: "auth/logout/rejected"; payload: Error };
type AuthUpdateUserPending = { type: "user/update/pending" };
type AuthUpdateUserFulfilled = { type: "user/update/fulfilled"; payload: User };
type AuthUpdateUserRejected = { type: "user/update/rejected"; payload: Error };

export const authLoginPending = (): AuthLoginPending => ({
	type: "auth/login/pending",
});
export const authLoginFulfilled = (user: User): AuthLoginFulfilled => ({
	type: "auth/login/fulfilled",
	payload: user,
});
export const authLoginRejected = (error: Error): AuthLoginRejected => ({
	type: "auth/login/rejected",
	payload: error,
});
export const authLogoutPending = (): AuthLogoutPending => ({
	type: "auth/logout/pending",
});
export const authLogoutFulfilled = (): AuthLogoutFulfilled => ({
	type: "auth/logout/fulfilled",
});
export const authLogoutRejected = (error: Error): AuthLogoutRejected => ({
	type: "auth/logout/rejected",
	payload: error,
});

export function login(credentials: Credentials): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		dispatch(authLoginPending());
		try {
			const user = await api.auth.login(credentials);
			if (user) {
				dispatch(authLoginFulfilled(user));
				const to = router.state.location.state?.from ?? "/boards";
				router.navigate(to, { replace: true });
			}
		} catch (error) {
			localStorage.removeItem("auth");
			localStorage.removeItem("user");
			removeAuthorizationHeader();
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export interface OAuthLoginPayload {
	token: string;
	user: User;
}

export function loginWithOAuth(
	payload: OAuthLoginPayload,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		const { token, user: userObj } = payload;
		dispatch(authLoginPending());
		try {
			localStorage.setItem("auth", token);
			setAuthorizationHeader(token);
			localStorage.setItem("user", JSON.stringify(userObj));

			const user = await api.auth.me();
			if (!user) {
				localStorage.removeItem("auth");
				localStorage.removeItem("user");
				removeAuthorizationHeader();
			} else {
				dispatch(authLoginFulfilled(user));
				const to = router.state.location.state?.from ?? "/boards";
				router.navigate(to, { replace: true });
			}
		} catch (error) {
			localStorage.removeItem("auth");
			localStorage.removeItem("user");
			removeAuthorizationHeader();
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function logout(): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		dispatch(authLogoutPending());
		try {
			await api.auth.logout();
			dispatch(authLogoutFulfilled());
			router.navigate("/login", { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLogoutRejected(error));
			}
			throw error;
		}
	};
}

export type AuthActions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogoutPending
	| AuthLogoutFulfilled
	| AuthLogoutRejected
	| AuthUpdateUserPending
	| AuthUpdateUserFulfilled
	| AuthUpdateUserRejected;

export type AuthActionsRejected =
	| AuthLoginRejected
	| AuthLogoutRejected
	| AuthUpdateUserRejected;
