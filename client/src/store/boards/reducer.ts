import type { Actions, ActionsRejected } from "./actions";
import type { Board, Column } from "../../pages/boards/types";
import type { BoardsState } from "../types/defaultStates";

const storedUser = localStorage.getItem("user");
const defaultState: BoardsState = {
	auth: {
		isAuthenticated: false,
		error: null,
		user: storedUser ? JSON.parse(storedUser) : null,
	},
	profile: null,
	boards: { boards: [], currentBoard: null, loading: false, error: null },
	ui: { pending: false, error: null },
};

//
// ─── BOARDS REDUCER ──────────────────────────────────────────────
//

export function boardsReducer(
	state = defaultState.boards,
	action: Actions,
): BoardsState["boards"] {
	switch (action.type) {
		case "boards/fetchBoard/pending":
			return { ...state, loading: true, error: null };

		case "boards/fetchBoards/fulfilled":
			return { ...state, loading: false, boards: action.payload };

		case "boards/fetchBoard/fulfilled":
			return { ...state, loading: false, currentBoard: action.payload };

		case "boards/fetchBoard/rejected":
			return { ...state, loading: false, error: action.payload.message };

		case "boards/addBoard/fulfilled":
			return { ...state, boards: [action.payload, ...state.boards] };

		case "boards/deleteBoards":
			return {
				...state,
				boards: state.boards.filter(
					(board: Board) => board.id !== action.payload,
				),
			};

		case "boards/editBoard/fulfilled":
			return {
				...state,
				boards: state.boards.map((board: Board) => {
					if (board.id !== action.payload.boardId) return board;

					return {
						...board,
						title: action.payload.data.title,
						image: action.payload.data.image,
					};
				}),
			};

		case "boards/addColumn/fulfilled":
			return state.currentBoard
				? {
						...state,
						currentBoard: {
							...state.currentBoard,
							lists: [...state.currentBoard.lists, action.payload],
						},
					}
				: state;
		case "boards/editColumn/fulfilled":
			if (!state.currentBoard) return state;
			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col: Column) =>
						col.id === action.payload.column.id
							? { ...col, title: action.payload.column.title }
							: col,
					),
				},
			};
		case "boards/deleteColumn/fulfilled":
			if (!state.currentBoard) return state;
			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.filter(
						(col: Column) => col.id?.toString() !== action.payload.columnId,
					),
				},
			};

		case "boards/addTask/fulfilled":
			return state.currentBoard
				? {
						...state,
						currentBoard: {
							...state.currentBoard,
							lists: state.currentBoard.lists.map((col: Column) =>
								col.id?.toString() === action.payload.columnId.toString()
									? {
											...col,
											cards: [action.payload.task, ...(col.cards || [])],
										}
									: col,
							),
						},
					}
				: state;
		case "boards/editTask/fulfilled": {
			if (!state.currentBoard) return state;

			const { columnId, task } = action.payload;

			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col: Column) => {
						if (col.id?.toString() === columnId.toString()) {
							const withoutTask = col.cards.filter((t) => t.id !== task.id);
							const withTask = [...withoutTask, task];

							withTask.sort((a, b) => a.position - b.position);

							return { ...col, cards: withTask };
						}

						return {
							...col,
							cards: col.cards.filter((t) => t.id !== task.id),
						};
					}),
				},
			};
		}

		case "boards/deleteTask/fulfilled":
			if (!state.currentBoard) return state;
			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col: Column) =>
						col.id === action.payload.columnId
							? {
									...col,
									cards: col.cards.filter(
										(task) => task.id!.toString() !== action.payload.taskId,
									),
								}
							: col,
					),
				},
			};
		case "cards/addAssignee/fulfilled":
			if (!state.currentBoard) return state;

			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col: Column) => ({
						...col,
						cards: col.cards.map((task) =>
							task.id === action.payload.cardId
								? {
										...task,
										assignees: [
											...task.assignees,
											{
												cardId: action.payload.cardId,
												userId: action.payload.user.id,
												user: action.payload.user,
											},
										],
									}
								: task,
						),
					})),
				},
			};

		case "cards/removeAssignee/fulfilled":
			if (!state.currentBoard) return state;
			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col: Column) => ({
						...col,
						cards: col.cards.map((task) =>
							task.id === action.payload.cardId
								? {
										...task,
										assignees:
											task.assignees?.filter(
												(user) => user.userId !== action.payload.userId,
											) || [],
									}
								: task,
						),
					})),
				},
			};

		default:
			return state;
	}
}

//
// ─── UI REDUCER ──────────────────────────────────────────────
//

function isRejectedAction(action: Actions): action is ActionsRejected {
	return action.type.endsWith("/rejected");
}

export function ui(
	state = defaultState.ui,
	action: Actions,
): BoardsState["ui"] {
	if (action.type.endsWith("/pending")) {
		return { pending: true, error: null };
	}
	if (action.type.endsWith("/fulfilled")) {
		return { pending: false, error: null };
	}
	if (isRejectedAction(action)) {
		return { pending: false, error: action.payload };
	}
	if (action.type === "ui/reset-error") {
		return { ...state, error: null };
	}
	return state;
}
