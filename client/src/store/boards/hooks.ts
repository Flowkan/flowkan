import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "..";
import type { Column, Task } from "../../pages/boards/types";
import {
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
	updateRemoteBoard,
	addLabel,
	removeLabel,
} from "./actions";
import {
	getBoards,
	getCurrentBoard,
	getBoardsLoading,
	getBoardsError,
	getUiPending,
	getUiError,
} from "./selectors";
import type { DropResult } from "@hello-pangea/dnd";

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
	return function (page: number, limit: number) {
		return dispatch(fetchBoards({ page, limit }));
	};
}

export function useFetchBoardByIdAction() {
	const dispatch = useAppDispatch();
	return useCallback(
		(slug: string) => {
			dispatch(fetchBoard(slug));
		},
		[dispatch],
	);
}

export function useUpdateBoardRemote() {
	const dispatch = useAppDispatch();
	return function (result: DropResult) {
		return dispatch(updateRemoteBoard(result));
	};
}

export function useAddBoardAction() {
	const dispatch = useAppDispatch();
	return function (board: FormData) {
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
	return function (
		columnId: number,
		taskId: string,
		task: Partial<Task> | FormData,
	) {
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

// --- LABELS -----
export function useAddLabelAction() {
	const dispatch = useAppDispatch();
	return (taskId: string, labelId: string) =>
		dispatch(addLabel(taskId, labelId));
}

export function useRemoveLabelAction() {
	const dispatch = useAppDispatch();
	return (taskId: string, labelId: string) =>
		dispatch(removeLabel(taskId, labelId));
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
