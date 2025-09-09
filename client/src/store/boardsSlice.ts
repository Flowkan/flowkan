import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import {
	getBoards,
	getBoard,
	createBoard,
	updateBoard,
	deleteBoard,
	createColumn,
	updateColumn,
	deleteColumn,
	createTask,
	updateTask,
	deleteTask,
} from "../pages/boards/service";
import type { Board, BoardsData, Column, Task } from "../pages/boards/types";
import { AxiosError } from "axios";

interface BoardsState {
	boards: Board[];
	currentBoard: Board | null;
	status: "idle" | "loading" | "succeeded" | "failed";
	error: string | null;
}

const initialState: BoardsState = {
	boards: [],
	currentBoard: null,
	status: "idle",
	error: null,
};

export const fetchBoards = createAsyncThunk<
	Board[],
	void,
	{ rejectValue: string }
>("boards/fetchBoards", async (_, thunkAPI) => {
	try {
		return await getBoards();
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al cargar tableros",
		);
	}
});

export const fetchBoard = createAsyncThunk<
	Board,
	string,
	{ rejectValue: string }
>("boards/fetchBoard", async (boardId, thunkAPI) => {
	try {
		return await getBoard(boardId);
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al cargar tablero",
		);
	}
});

export const addBoard = createAsyncThunk<
	Board,
	BoardsData,
	{ rejectValue: string }
>("boards/addBoard", async (boardData, thunkAPI) => {
	try {
		return await createBoard(boardData);
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al crear tablero",
		);
	}
});

export const editBoard = createAsyncThunk<
	Board,
	{ id: string; data: BoardsData },
	{ rejectValue: string }
>("boards/editBoard", async ({ id, data }, thunkAPI) => {
	try {
		return await updateBoard(id, data);
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al actualizar tablero",
		);
	}
});

export const removeBoard = createAsyncThunk<
	string,
	string,
	{ rejectValue: string }
>("boards/removeBoard", async (boardId, thunkAPI) => {
	try {
		await deleteBoard(boardId);
		return boardId;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al eliminar tablero",
		);
	}
});

export const addTask = createAsyncThunk<
	{ columnId: number; task: Task },
	{ boardId: string; columnId: number; task: Partial<Task> },
	{ rejectValue: string }
>("boards/addTask", async ({ columnId, task }, thunkAPI) => {
	try {
		const response = await createTask(columnId, task);
		return { columnId, task: response };
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al añadir tarea",
		);
	}
});

export const addBoardColumn = createAsyncThunk<
	Column,
	{ boardId: string; column: Column },
	{ rejectValue: string }
>("boards/addBoardColumn", async ({ boardId, column }, thunkAPI) => {
	try {
		const response = await createColumn(boardId, column);
		return response;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al crear columna",
		);
	}
});

export const updateColumnThunk = createAsyncThunk<
	Column,
	{ columnId: string; data: Partial<Column> },
	{ rejectValue: string }
>("boards/updateColumn", async ({ columnId, data }, thunkAPI) => {
	try {
		const response = await updateColumn(columnId, data);
		return response;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al actualizar columna",
		);
	}
});

export const deleteColumnThunk = createAsyncThunk<
	string,
	{ columnId: string },
	{ rejectValue: string }
>("boards/deleteColumn", async ({ columnId }, thunkAPI) => {
	try {
		await deleteColumn(columnId);
		return columnId;
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al eliminar columna",
		);
	}
});

export const updateColumnOrder = createAsyncThunk<
	{ columnOrder: string[] },
	{ boardId: string; newOrder: string[] },
	{ rejectValue: string }
>("boards/updateColumnOrder", async ({ newOrder }, thunkAPI) => {
	try {
		return { columnOrder: newOrder };
	} catch {
		return thunkAPI.rejectWithValue("Error al actualizar orden de columnas");
	}
});

export const updateTaskThunk = createAsyncThunk<
	{ columnId: string; task: Task },
	{ columnId: string; taskId: string; task: Partial<Task> },
	{ rejectValue: string }
>("boards/updateTask", async ({ columnId, taskId, task }, thunkAPI) => {
	try {
		const response = await updateTask(taskId, task);
		return { columnId, task: response };
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al actualizar tarea",
		);
	}
});

export const deleteTaskThunk = createAsyncThunk<
	{ columnId: string; taskId: string },
	{ boardId: string; columnId: string; taskId: string },
	{ rejectValue: string }
>("boards/deleteTask", async ({ columnId, taskId }, thunkAPI) => {
	try {
		await deleteTask(taskId);
		return { columnId, taskId };
	} catch (err: unknown) {
		const error = err as AxiosError<{ message?: string }>;
		return thunkAPI.rejectWithValue(
			error.response?.data?.message || "Error al eliminar tarea",
		);
	}
});

const boardsSlice = createSlice({
	name: "boards",
	initialState,
	reducers: {
		updateColumnsLocal: (
			state,
			action: PayloadAction<{
				sourceId: string;
				destId: string;
				newSourceCards: Task[];
				newDestCards: Task[];
			}>,
		) => {
			if (!state.currentBoard) return;

			const { sourceId, destId, newSourceCards, newDestCards } = action.payload;

			state.currentBoard.lists = state.currentBoard.lists.map((list) => {
				if (list.id?.toString() === sourceId) {
					return {
						...list,
						cards: newSourceCards,
					};
				}
				if (list.id?.toString() === destId && sourceId !== destId) {
					return {
						...list,
						cards: newDestCards,
					};
				}
				return list;
			});
		},

		updateColumnOrderLocal: (state, action: PayloadAction<Column[]>) => {
			if (!state.currentBoard) return;
			state.currentBoard.lists = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchBoards.pending, (state) => {
				state.status = "loading";
				state.error = null;
			})
			.addCase(fetchBoards.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.boards = action.payload;
			})
			.addCase(fetchBoards.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Error desconocido";
			})
			.addCase(fetchBoard.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.currentBoard = action.payload;
			})
			.addCase(fetchBoard.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Error desconocido";
			})
			.addCase(addBoard.fulfilled, (state, action) => {
				state.boards.push(action.payload);
			})
			.addCase(editBoard.fulfilled, (state, action) => {
				const idx = state.boards.findIndex((b) => b.id === action.payload.id);
				if (idx !== -1) {
					state.boards[idx] = action.payload;
				}
			})
			.addCase(removeBoard.fulfilled, (state, action) => {
				state.boards = state.boards.filter((b) => b.id !== action.payload);
			})
			.addCase(addBoardColumn.fulfilled, (state, action) => {
				const newColumn = action.payload;
				if (state.currentBoard && newColumn.id) {
					state.currentBoard.lists.push(newColumn);
				}
				state.status = "succeeded";
			})
			.addCase(deleteColumnThunk.fulfilled, (state, action) => {
				const columnIdToDelete = action.payload;
				if (state.currentBoard?.lists) {
					state.currentBoard.lists = state.currentBoard.lists.filter(
						(column) => column.id !== columnIdToDelete,
					);
				}
			})
			.addCase(updateColumnThunk.fulfilled, (state, action) => {
				const updatedColumn = action.payload;
				if (state.currentBoard && updatedColumn.id) {
					state.currentBoard.lists.push(updatedColumn);
				}
			})
			.addCase(updateColumnOrder.fulfilled, (state, action) => {
				if (state.currentBoard) {
					const newOrderIds = action.payload.columnOrder;
					state.currentBoard.lists = newOrderIds
						.map((columnId) =>
							state.currentBoard!.lists.find(
								(column) => column.id === columnId,
							),
						)
						.filter(Boolean) as Column[];
				}
			})
			.addCase(addTask.fulfilled, (state, action) => {
				const { columnId, task } = action.payload;
				if (state.currentBoard?.lists) {
					const column = state.currentBoard.lists.find(
						(c) => c.id?.toString() === columnId.toString(),
					);
					if (column) {
						column.cards.push(task);
					}
				}
				state.status = "succeeded";
			})
			.addCase(addTask.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.payload || "Error desconocido al añadir tarea";
			})
			.addCase(updateTaskThunk.fulfilled, (state, action) => {
				const { columnId, task } = action.payload;
				if (state.currentBoard?.lists) {
					const columnIndex = state.currentBoard.lists.findIndex(
						(column) => column.id === columnId,
					);
					if (columnIndex !== -1) {
						state.currentBoard.lists[columnIndex].cards =
							state.currentBoard.lists[columnIndex].cards.map((t) =>
								t.id === task.id ? task : t,
							);
					}
				}
			})
			.addCase(deleteTaskThunk.fulfilled, (state, action) => {
				const { columnId, taskId } = action.payload;
				if (state.currentBoard) {
					const columnIndex = state.currentBoard.lists.findIndex(
						(column) => column.id === columnId,
					);
					if (columnIndex !== -1) {
						state.currentBoard.lists[columnIndex].cards =
							state.currentBoard.lists[columnIndex].cards.filter(
								(t) => t.id !== Number(taskId),
							);
					}
				}
			})
			.addMatcher(
				(action) => action.type.endsWith("/pending"),
				(state) => {
					state.status = "loading";
				},
			);
	},
});

export const { updateColumnsLocal, updateColumnOrderLocal } =
	boardsSlice.actions;
export default boardsSlice.reducer;
