import type { RootState } from ".";
import type { BoardData, Column, Task } from "../types";

export const hasLogged = (state: RootState) => state.auth;

export const getBoardData = (state: RootState): BoardData | null =>
	state.boards.data;

export function getColumn(columnId: string) {
	return function (state: RootState): Column | undefined {
		return state.boards.data?.columns[columnId];
	};
}

export function getTask(columnId: string, taskId: string) {
	return function (state: RootState): Task | undefined {
		const column = state.boards.data?.columns[columnId];
		return column?.items.find((task) => task.id === taskId);
	};
}

export const getColumnOrder = (state: RootState): string[] | undefined =>
	state.boards.data?.columnOrder;

export const getUi = (state: RootState) => state.ui;

export const areBoardsLoaded = (state: RootState) => state.boards.loaded;

export function getColumnTasks(columnId: string) {
	return function (state: RootState): Task[] {
		return state.boards.data?.columns[columnId]?.items || [];
	};
}
