import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from ".";
import type { BoardsData, Column, Task } from "../pages/boards/types";
import type { Credentials, User } from "../pages/login/types";
import {
	login,
	logout,
	resetError,
	fetchBoards,
	fetchBoard,
	addBoard,
	addColumn,
	removeColumn,
	addTask,
	editTask,
	removeTask,
	editColumn,
	addAssignee,
	removeAssignee,
	updateProfile,
	loadedProfile,
} from "./actions";
import {
	isAuthenticated,
	getAuthError,
	getBoards,
	getCurrentBoard,
	getBoardsLoading,
	getBoardsError,
	getUiPending,
	getUiError,
} from "./selectors";
import type { ProfileType } from "../pages/profile/types";

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

//
// ─── BOARDS PROFILE ──────────────────────────────────────────────
//
export function useUpdatedProfile(){
	const dispatch = useAppDispatch();
	return function ({user,profile}:{user:User,profile:ProfileType}){
		return dispatch(updateProfile({user,profile}))
	}
}

export function useLoadedProfile(){
	const dispatch = useAppDispatch();
	return function (){
		return dispatch(loadedProfile())
	}
}

//
// ─── BOARDS HOOKS ──────────────────────────────────────────────
//
export function useBoards() {
	return useAppSelector(getBoards);
}

export function useCurrentBoard() {
	return useAppSelector(getCurrentBoard);
}

export function useBoardsLoading() {
	return useAppSelector(getBoardsLoading);
}

export function useBoardsError() {
	return useAppSelector(getBoardsError);
}

export function useFetchBoardsAction() {
	const dispatch = useAppDispatch();
	return function () {
		return dispatch(fetchBoards());
	};
}

export function useFetchBoardByIdAction() {
	const dispatch = useAppDispatch();
	return useCallback(
		(id: string) => {
			dispatch(fetchBoard(id));
		},
		[dispatch],
	);
}

export function useAddBoardAction() {
	const dispatch = useAppDispatch();
	return function (board: BoardsData) {
		return dispatch(addBoard(board));
	};
}

export function useAddColumnAction() {
	const dispatch = useAppDispatch();
	return function (boardId: string, column: Column) {
		return dispatch(addColumn(boardId, column));
	};
}

export function useUpdateColumnAction() {
	const dispatch = useAppDispatch();
	return function (columnId: number, column: Partial<Column>) {
		return dispatch(editColumn(columnId, column));
	};
}

export function useDeleteColumnAction() {
	const dispatch = useAppDispatch();
	return function (columnId: string) {
		return dispatch(removeColumn(columnId));
	};
}

export function useAddTaskAction() {
	const dispatch = useAppDispatch();
	return function (columnId: number, task: Partial<Task>) {
		return dispatch(addTask(columnId, task));
	};
}

export function useUpdateTaskAction() {
	const dispatch = useAppDispatch();
	return function (columnId: number, taskId: string, task: Partial<Task>) {
		return dispatch(editTask(columnId, taskId, task));
	};
}

export function useDeleteTaskction() {
	const dispatch = useAppDispatch();
	return function (columnId: string, taskId: string) {
		return dispatch(removeTask(columnId, taskId));
	};
}

// ─── ASSIGNEES ────────────────────────────────
export function useAddAssigneeAction() {
	const dispatch = useAppDispatch();
	return function (cardId: number, userId: number) {
		return dispatch(addAssignee(cardId, userId));
	};
}

export function useRemoveAssigneeAction() {
	const dispatch = useAppDispatch();
	return function (cardId: number, userId: number) {
		return dispatch(removeAssignee(cardId, userId));
	};
}

//
// ─── UI HOOKS ──────────────────────────────────────────────
//
export function useUiPending() {
	return useAppSelector(getUiPending);
}

export function useUiError() {
	return useAppSelector(getUiError);
}
