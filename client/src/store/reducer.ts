import type { Actions, ActionsRejected } from "./actions";
import type { Board, Column } from "../pages/boards/types";
import type { User } from "../pages/login/types";
import type { ProfileType } from "../pages/profile/types";

//
// ─── STATE GLOBAL ──────────────────────────────────────────────
//

export type State = {
	auth: {
		user: User | null;
		isAuthenticated: boolean;
		error: string | null;
	};
	profile: ProfileType;
	boards: {
		boards: Board[];
		currentBoard: Board | null;
		loading: boolean;
		error: string | null;
	};
	ui: {
		pending: boolean;
		error: Error | null;
	};
};

const storedUser = localStorage.getItem("user");
const defaultState: State = {
	auth: {
		isAuthenticated: false,
		error: null,
		user: storedUser ? JSON.parse(storedUser) : null,
	},
	profile: {
		username: "",
		dateBirth: "",
		location: "",
		allowNotifications: true,
		bio: "",
	},
	boards: { boards: [], currentBoard: null, loading: false, error: null },
	ui: { pending: false, error: null },
};

//
// ─── AUTH REDUCER ──────────────────────────────────────────────
//
export function auth(
	state = defaultState.auth,
	action: Actions,
): State["auth"] {
	switch (action.type) {
		case "auth/login/pending":
			return { ...state, error: null, isAuthenticated: false, user: null };
		case "auth/login/fulfilled":
			return { ...state, isAuthenticated: true, user: action.payload };
		case "auth/login/rejected":
			return {
				...state,
				error: action.payload.message,
				isAuthenticated: false,
				user: null,
			};
		case "auth/logout/pending":
			return { ...state, error: null, isAuthenticated: true, user: state.user };

		case "auth/logout/fulfilled":
			return { ...state, isAuthenticated: false, user: null };

		case "auth/logout/rejected":
			return {
				...state,
				error: action.payload.message,
				isAuthenticated: true,
				user: state.user,
			};
		case "user/update/pending":
		case "user/update/rejected":
			return state;
		case "user/update/fulfilled":
			return {
				...state,
				user: action.payload,
			};
		default:
			return state;
	}
}

//
// ─── PROFILE REDUCER ──────────────────────────────────────────────
//
export function profile(
	state = defaultState.profile,
	action: Actions,
): State["profile"] {
	switch (action.type) {
		case "profile/update/pending":
		case "profile/update/rejected":
		case "profile/loaded/pending":
		case "profile/loaded/rejected":
			return state;
		case "profile/update/fulfilled":
		case "profile/loaded/fulfilled":
			return { ...action.payload };
		default:
			return state;
	}
}

//
// ─── BOARDS REDUCER ──────────────────────────────────────────────
//
export function boards(
	state = defaultState.boards,
	action: Actions,
): State["boards"] {
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
				boards: state.boards.filter((board) => board.id !== action.payload),
			};

		case "boards/editBoard/fulfilled":
			return {
				...state,
				boards: state.boards.map((board) => {
					if (board.id !== action.payload.boardId) return board;

					return { ...board, title: action.payload.data.title };
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
					lists: state.currentBoard.lists.map((col) =>
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
						(col) => col.id?.toString() !== action.payload.columnId,
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
									? { ...col, cards: [action.payload.task, ...col.cards] }
									: col,
							),
						},
					}
				: state;
		case "boards/editTask/fulfilled": {
			if (!state.currentBoard) return state;

			const { task } = action.payload;

			return {
				...state,
				currentBoard: {
					...state.currentBoard,
					lists: state.currentBoard.lists.map((col) => {
						if (col.id?.toString() === task.listId.toString()) {
							const withoutTask = col.cards.filter((t) => t.id !== task.id);
							const withTask = [...withoutTask, task];

							withTask.sort((a, b) => a.position - b.position);

							return {
								...col,
								cards: withTask,
							};
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
					lists: state.currentBoard.lists.map((col) =>
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
					lists: state.currentBoard.lists.map((col) => ({
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
					lists: state.currentBoard.lists.map((col) => ({
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

export function ui(state = defaultState.ui, action: Actions): State["ui"] {
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
