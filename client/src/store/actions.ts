import type { AppThunk } from ".";
import type { Credentials } from "../pages/login/types";
import type { Board, BoardData } from "../pages/boards/types";

type AuthLoginPending = {
	type: "auth/login/pending";
};

type AuthLoginFulfilled = {
	type: "auth/login/fulfilled";
	payload: {
		id: number;
		name: string;
		email: string;
		photo?: string;
	};
};

type AuthLoginRejected = {
	type: "auth/login/rejected";
	payload: Error;
};

type AuthLogout = {
	type: "auth/logout";
};

type UiResetError = {
	type: "ui/reset-error";
};

type BoardsLoadPending = {
	type: "boards/load/pending";
};

type BoardsLoadFulfilled = {
	type: "boards/load/fulfilled";
	payload: Board[];
};

type BoardsLoadRejected = {
	type: "boards/load/rejected";
	payload: Error;
};

type BoardsAddPending = {
	type: "boards/add/pending";
};

type BoardsAddFulfilled = {
	type: "boards/add/fulfilled";
	payload: Board;
};

type BoardsAddRejected = {
	type: "boards/add/rejected";
	payload: Error;
};

type BoardsUpdatePending = {
	type: "boards/update/pending";
};

type BoardsUpdateFulfilled = {
	type: "boards/update/fulfilled";
	payload: Board;
};

type BoardsUpdateRejected = {
	type: "boards/update/rejected";
	payload: Error;
};

type BoardsDeletePending = {
	type: "boards/delete/pending";
};

type BoardsDeleteFulfilled = {
	type: "boards/delete/fulfilled";
	payload: string;
};

type BoardsDeleteRejected = {
	type: "boards/delete/rejected";
	payload: Error;
};

export const authLoginPending = (): AuthLoginPending => ({
	type: "auth/login/pending",
});

export const authLoginFulfilled = (
	user: AuthLoginFulfilled["payload"],
): AuthLoginFulfilled => ({
	type: "auth/login/fulfilled",
	payload: user,
});

export const authLoginRejected = (error: Error): AuthLoginRejected => ({
	type: "auth/login/rejected",
	payload: error,
});

export const boardsLoadPending = (): BoardsLoadPending => ({
	type: "boards/load/pending",
});

export const boardsLoadFulfilled = (boards: Board[]): BoardsLoadFulfilled => ({
	type: "boards/load/fulfilled",
	payload: boards,
});

export const boardsLoadRejected = (error: Error): BoardsLoadRejected => ({
	type: "boards/load/rejected",
	payload: error,
});

export const boardsAddPending = (): BoardsAddPending => ({
	type: "boards/add/pending",
});
export const boardsAddFulfilled = (newBoard: Board): BoardsAddFulfilled => ({
	type: "boards/add/fulfilled",
	payload: newBoard,
});
export const boardsAddRejected = (error: Error): BoardsAddRejected => ({
	type: "boards/add/rejected",
	payload: error,
});

export const boardsUpdatePending = (): BoardsUpdatePending => ({
	type: "boards/update/pending",
});
export const boardsUpdateFulfilled = (
	updatedBoard: Board,
): BoardsUpdateFulfilled => ({
	type: "boards/update/fulfilled",
	payload: updatedBoard,
});
export const boardsUpdateRejected = (error: Error): BoardsUpdateRejected => ({
	type: "boards/update/rejected",
	payload: error,
});

export const boardsDeletePending = (): BoardsDeletePending => ({
	type: "boards/delete/pending",
});
export const boardsDeleteFulfilled = (
	boardId: string,
): BoardsDeleteFulfilled => ({
	type: "boards/delete/fulfilled",
	payload: boardId,
});
export const boardsDeleteRejected = (error: Error): BoardsDeleteRejected => ({
	type: "boards/delete/rejected",
	payload: error,
});

export function authLogin(credentials: Credentials): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api, router }) {
		dispatch(authLoginPending());
		try {
			const user = await api.auth.login(credentials);
			dispatch(authLoginFulfilled(user));

			const to = router.state.location.state?.from ?? "/";
			router.navigate(to, { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function authLogout(): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		await api.auth.logout();
		dispatch({ type: "auth/logout" });
	};
}

export function boardsLoad(): AppThunk<Promise<void>> {
	return async function (dispatch, getState, { api }) {
		// if boards are already loaded in state, return them without reloading them
		const state = getState();
		if (state.boards.loaded) {
			return;
		}

		try {
			dispatch(boardsLoadPending());
			const boards = await api.boards.getBoards();
			dispatch(boardsLoadFulfilled(boards));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsLoadRejected(error));
			}
		}
	};
}

export const boardsAdd =
	(boardData: BoardData): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsAddPending());
		try {
			const newBoard = await api.boards.createBoard(boardData);
			dispatch(boardsAddFulfilled(newBoard));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsAddRejected(error));
			}
		}
	};

export const boardsUpdate =
	(boardId: string, boardData: BoardData): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsUpdatePending());
		try {
			const updatedBoard = await api.boards.updateBoard(boardId, boardData);
			dispatch(boardsUpdateFulfilled(updatedBoard));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsUpdateRejected(error));
			}
		}
	};

export const boardsDelete =
	(boardId: string): AppThunk<Promise<void>> =>
	async (dispatch, _getState, { api }) => {
		dispatch(boardsDeletePending());
		try {
			await api.boards.deleteBoard(boardId);
			dispatch(boardsDeleteFulfilled(boardId));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(boardsDeleteRejected(error));
			}
		}
	};

export const resetError = (): UiResetError => ({
	type: "ui/reset-error",
});

export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogout
	| UiResetError
	| BoardsLoadPending
	| BoardsLoadFulfilled
	| BoardsLoadRejected
	| BoardsAddPending
	| BoardsAddFulfilled
	| BoardsAddRejected
	| BoardsUpdatePending
	| BoardsUpdateFulfilled
	| BoardsUpdateRejected
	| BoardsDeletePending
	| BoardsDeleteFulfilled
	| BoardsDeleteRejected;

export type ActionsRejected =
	| AuthLoginRejected
	| BoardsLoadRejected
	| BoardsAddRejected
	| BoardsUpdateRejected
	| BoardsDeleteRejected;
