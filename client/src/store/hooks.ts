import { useAppDispatch, useAppSelector } from ".";
import {
	loadInitialBoard,
	createColumn,
	createTask,
	columnDeleted,
	columnTitleEdited,
	taskEditedFulfilled,
	taskDeleted,
	boardReordered,
	authLogin,
	authLogout,
} from "./actions";
import {
	getBoardData,
	getColumn,
	getTask,
	getColumnOrder,
	getUi,
	getColumnTasks,
	hasLogged,
} from "./selectors";
import type { BoardData } from "../types";
import type { Credentials } from "./actions";

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

export function useBoardData() {
	return useAppSelector(getBoardData);
}

export function useColumn(columnId: string) {
	return useAppSelector(getColumn(columnId));
}

export function useTask(columnId: string, taskId: string) {
	return useAppSelector(getTask(columnId, taskId));
}

export function useColumnOrder() {
	return useAppSelector(getColumnOrder);
}

export function useColumnTasks(columnId: string) {
	return useAppSelector(getColumnTasks(columnId));
}

export function useLoadInitialBoardAction() {
	const dispatch = useAppDispatch();
	return () => dispatch(loadInitialBoard());
}

export function useCreateColumnAction() {
	const dispatch = useAppDispatch();
	return (title: string) => dispatch(createColumn(title));
}

export function useDeleteColumnAction() {
	const dispatch = useAppDispatch();
	return (columnId: string) => dispatch(columnDeleted(columnId));
}

export function useEditColumnTitleAction() {
	const dispatch = useAppDispatch();
	return (columnId: string, newTitle: string) =>
		dispatch(columnTitleEdited(columnId, newTitle));
}

export function useCreateTaskAction() {
	const dispatch = useAppDispatch();
	return (columnId: string, content: string) =>
		dispatch(createTask(columnId, content));
}

export function useEditTaskAction() {
	const dispatch = useAppDispatch();
	return (
		columnId: string,
		taskId: string,
		newContent: string,
		newDescription?: string,
	) =>
		dispatch(taskEditedFulfilled(columnId, taskId, newContent, newDescription));
}

export function useDeleteTaskAction() {
	const dispatch = useAppDispatch();
	return (columnId: string, taskId: string) =>
		dispatch(taskDeleted(columnId, taskId));
}

export function useBoardReorderedAction() {
	const dispatch = useAppDispatch();
	return (newBoardData: BoardData) => dispatch(boardReordered(newBoardData));
}

export function useUi() {
	return useAppSelector(getUi);
}

// Añadir useAuth, useLoginAction, useLogoutAction de tu ejemplo si los necesitas
// export function useAuth() { /* ... */ }
// export function useLoginAction() { /* ... */ }
// export function useLogoutAction() { /* ... */ }
