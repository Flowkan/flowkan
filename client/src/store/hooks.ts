import { useAppDispatch, useAppSelector } from ".";
import type { Credentials } from "../pages/login/types";
import {
	authLogin,
	authLogout,
	resetError,
	boardsLoad,
	boardsAdd,
	boardsUpdate,
	boardsDelete,
} from "./actions";
import { hasLogged, selectBoards } from "./selectors";
import type { Board, BoardData } from "../pages/boards/types";
import { useEffect } from "react";

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

export function useBoardsAction(): Board[] {
	const dispatch = useAppDispatch();
	const boards = useAppSelector(selectBoards);

	useEffect(() => {
		dispatch(boardsLoad());
	}, [dispatch]);

	return boards;
}

export function useBoardsAddAction() {
	const dispatch = useAppDispatch();
	return async function (boardData: FormData): Promise<Board> {
		return await dispatch(boardsAdd(boardData));
	};
}

export function useBoardsUpdateAction() {
	const dispatch = useAppDispatch();
	return (boardId: string, boardData: BoardData) =>
		dispatch(boardsUpdate(boardId, boardData));
}

export function useBoardsDeleteAction() {
	const dispatch = useAppDispatch();
	return (boardId: string) => dispatch(boardsDelete(boardId));
}
