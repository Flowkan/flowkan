import { useAppDispatch, useAppSelector } from "..";
import type { Credentials } from "../../pages/login/types";
import { resetError } from "../boards/actions";
import { login, logout } from "./actions";
import { getAuthError, isAuthenticated } from "./selectors";

//
// ─── AUTH HOOKS ──────────────────────────────────────────────
//

export function useAuth() {
	return useAppSelector(isAuthenticated);
}

export function useAuthError() {
	return useAppSelector(getAuthError);
}

export function useLoginAction() {
	const dispatch = useAppDispatch();
	return function (credentials: Credentials) {
		return dispatch(login(credentials));
	};
}

export function useLogoutAction() {
	const dispatch = useAppDispatch();
	return function () {
		return dispatch(logout());
	};
}

export function useUiResetError() {
	const dispatch = useAppDispatch();
	return function () {
		return dispatch(resetError());
	};
}
