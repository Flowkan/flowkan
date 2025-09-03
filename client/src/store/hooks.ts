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
	boardLoad,
	columnAdd,
	columnUpdate,
	columnDelete,
	taskAdd,
	taskUpdate,
	taskDelete,
} from "./actions";
import { hasLogged, selectBoards } from "./selectors";
import type { Board, BoardsData } from "../pages/boards/types";
import type { BoardData, Task, ColumnData } from "../pages/board/types";
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
	return (boardData: BoardsData) => dispatch(boardsAdd(boardData));
}

export function useBoardsUpdateAction() {
	const dispatch = useAppDispatch();
	return (boardId: string, boardData: BoardsData) =>
		dispatch(boardsUpdate(boardId, boardData));
}

export function useBoardsDeleteAction() {
	const dispatch = useAppDispatch();
	return (boardId: string) => dispatch(boardsDelete(boardId));
}

export function useBoards(): {
	data: Board[] | null;
	loaded: boolean;
	pending: boolean;
	error: Error | null;
} {
	return useAppSelector((state) => state.boards);
}

export function useBoard(): {
	data: BoardData | null;
	pending: boolean;
	error: Error | null;
} {
	return useAppSelector((state) => state.currentBoard);
}

// Este hook despacha la acción para cargar un tablero por su ID
export function useBoardLoadAction() {
	const dispatch = useAppDispatch();
	return (boardId: string) => dispatch(boardLoad(boardId));
}

export function useColumnAddAction() {
	const dispatch = useAppDispatch();
	return (columnData: ColumnData) => dispatch(columnAdd(columnData));
}

export function useColumnUpdateAction() {
	const dispatch = useAppDispatch();
	return (columnId: string, title: string) =>
		dispatch(columnUpdate(columnId, title));
}

export function useColumnDeleteAction() {
	const dispatch = useAppDispatch();
	return (columnId: string) => dispatch(columnDelete(columnId));
}

export function useTaskAddAction() {
	const dispatch = useAppDispatch();
	return (columnId: string, task: Task) => dispatch(taskAdd(columnId, task));
}

export function useTaskUpdateAction() {
	const dispatch = useAppDispatch();
	return (taskId: string, data: Partial<Task>) =>
		dispatch(taskUpdate(taskId, data));
}

export function useTaskDeleteAction() {
	const dispatch = useAppDispatch();
	return (taskId: string) => dispatch(taskDelete(taskId));
}
