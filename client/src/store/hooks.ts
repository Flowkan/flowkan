import { useAppDispatch, useAppSelector } from ".";
import type { Credentials } from "../pages/login/types";
import { authLogin, authLogout, resetError } from "./actions";
import { hasLogged } from "./selectors";
import { boardsLoad } from "./actions";
import type { Board } from "../pages/boards/types";

export function useAuth() {
	return useAppSelector(hasLogged);
}

export function useLoginAction() {
	const dispatch = useAppDispatch();
	return (credentials: Credentials) => dispatch(authLogin(credentials));
}

export function useLogoutAction() {
	const dispatch = useAppDispatch();
	return () => dispatch(authLogout());
}

export function useUiResetError() {
	const dispatch = useAppDispatch();
	return function () {
		return dispatch(resetError());
	};
}

export function useBoardsAction() {
	const dispatch = useAppDispatch();
	return () => dispatch(boardsLoad());
}

export function useBoards(): {
	data: Board[] | null;
	loaded: boolean;
	pending: boolean;
	error: Error | null;
} {
	return useAppSelector((state) => state.boards);
}
