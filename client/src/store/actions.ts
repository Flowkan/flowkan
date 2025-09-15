import type { AppThunk } from ".";
import type { Credentials, User } from "../pages/login/types";
import type { Board, BoardsData, Column, Task } from "../pages/boards/types";
import type { ProfileType } from "../pages/profile/types";

//
// ─── AUTH ──────────────────────────────────────────────
//
type AuthLoginPending = { type: "auth/login/pending" };
type AuthLoginFulfilled = { type: "auth/login/fulfilled"; payload: User };
type AuthLoginRejected = { type: "auth/login/rejected"; payload: Error };
type AuthLogoutPending = { type: "auth/logout/pending" };
type AuthLogoutFulfilled = { type: "auth/logout/fulfilled" };
type AuthLogoutRejected = { type: "auth/logout/rejected"; payload: Error };

export const authLoginPending = (): AuthLoginPending => ({
	type: "auth/login/pending",
});
export const authLoginFulfilled = (user: User): AuthLoginFulfilled => ({
	type: "auth/login/fulfilled",
	payload: user,
});
export const authLoginRejected = (error: Error): AuthLoginRejected => ({
	type: "auth/login/rejected",
	payload: error,
});
export const authLogoutPending = (): AuthLogoutPending => ({
	type: "auth/logout/pending",
});
export const authLogoutFulfilled = (): AuthLogoutFulfilled => ({
	type: "auth/logout/fulfilled",
});
export const authLogoutRejected = (error: Error): AuthLogoutRejected => ({
	type: "auth/logout/rejected",
	payload: error,
});

export function login(credentials: Credentials): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		dispatch(authLoginPending());
		try {
			const user = await api.auth.login(credentials);			
			dispatch(authLoginFulfilled(user));
			const to = router.state.location.state?.from ?? "/boards";
			router.navigate(to, { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLoginRejected(error));
			}
			throw error;
		}
	};
}

export function logout(): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api, router }) => {
		dispatch(authLogoutPending());
		try {
			await api.auth.logout();
			dispatch(authLogoutFulfilled());
			router.navigate("/login", { replace: true });
		} catch (error) {
			if (error instanceof Error) {
				dispatch(authLogoutRejected(error));
			}
			throw error;
		}
	};
}

//
// ─── PROFILE ──────────────────────────────────────────────
//

type UserUpdatePending = { type: "user/update/pending" };
type UserUpdateFulfilled = { type: "user/update/fulfilled"; payload: User };
type UserUpdateRejected = { type: "user/update/rejected"; payload: Error };

export const userUpdatePending = ():UserUpdatePending => ({
	type:'user/update/pending'
})
export const userUpdateFulFilled = (user:User):UserUpdateFulfilled => ({
	type:'user/update/fulfilled',
	payload:user
})
export const userUpdateRejected = (error:Error):UserUpdateRejected => ({
	type:'user/update/rejected',
	payload:error
})

type ProfileUpdatePending = { type: "profile/update/pending" };
type ProfileUpdateFulfilled = { type: "profile/update/fulfilled"; payload: ProfileType };
type ProfileUpdateRejected = { type: "profile/update/rejected"; payload: Error };

export const profileUpdatePending = ():ProfileUpdatePending => ({
	type:'profile/update/pending'
})
export const profileUpdateFulFilled = (profile:ProfileType):ProfileUpdateFulfilled => ({
	type:'profile/update/fulfilled',
	payload:profile
})
export const profileUpdateRejected = (error:Error):ProfileUpdateRejected => ({
	type:'profile/update/rejected',
	payload:error
})

type ProfileLoadedPending = { type: "profile/loaded/pending" };
type ProfileLoadedFulfilled = { type: "profile/loaded/fulfilled"; payload: ProfileType };
type ProfileLoadedRejected = { type: "profile/loaded/rejected"; payload: Error };

export const profileLoadedPending = ():ProfileLoadedPending => ({
	type:'profile/loaded/pending'
})
export const profileLoadedFulFilled = (profile:ProfileType):ProfileLoadedFulfilled => ({
	type:'profile/loaded/fulfilled',
	payload:profile
})
export const profileLoadedRejected = (error:Error):ProfileLoadedRejected => ({
	type:'profile/loaded/rejected',
	payload:error
})

export function loadedProfile():AppThunk<Promise<void>>{
	return async(dispatch,getState,{api})=>{
		const state = getState()
		if(state.profile){
			return
		}
		dispatch(profileLoadedPending())
		try {
			const { error,profile } = await api.profile.getProfileData();
			if(error){
				throw new Error(error)
			}
			if(profile){
				// console.log(profile);											
				dispatch(profileLoadedFulFilled(profile))
			}
		} catch (error) {
			if(error instanceof Error){
				dispatch(profileLoadedRejected(error))
			}
		}
	}
}


export function updateProfile({user,profile}:{user:User,profile:ProfileType}):AppThunk<Promise<void>>{
	return async (dispatch) => {
		dispatch(userUpdatePending())
		dispatch(profileUpdatePending())
		try {					
			dispatch(userUpdateFulFilled(user))
			dispatch(profileUpdateFulFilled(profile))
			// console.log(getState().auth.user);			
		} catch (error) {
			if(error instanceof Error){
				dispatch(userUpdateRejected(error))
			}
		}
	}
}

//
// ─── BOARDS ──────────────────────────────────────────────
//
type FetchBoardsPending = { type: "boards/fetchBoards/pending" };
type FetchBoardsFulfilled = {
	type: "boards/fetchBoards/fulfilled";
	payload: Board[];
};
type FetchBoardsRejected = {
	type: "boards/fetchBoards/rejected";
	payload: Error;
};

type FetchBoardPending = { type: "boards/fetchBoard/pending" };
type FetchBoardFulfilled = {
	type: "boards/fetchBoard/fulfilled";
	payload: Board;
};
type FetchBoardRejected = {
	type: "boards/fetchBoard/rejected";
	payload: Error;
};

type GetBoardUsersPending = { type: "boards/getBoardUsers/pending" };
type GetBoardUsersFulfilled = {
	type: "boards/getBoardUsers/fulfilled";
	payload: User[];
};
type GetBoardUsersRejected = {
	type: "boards/getBoardUsers/rejected";
	payload: Error;
};

type AddBoardFulfilled = { type: "boards/addBoard/fulfilled"; payload: Board };

type DeleteBoardFulfilled = {
	type: "boards/deleteBoards";
	payload: string;
};

type EditBoardFulfilled = {
	type: "boards/editBoard/fulfilled";
	payload: { boardId: string; data: BoardsData };
};

type EditBoardRejected = {
	type: "boards/editBoard/rejected";
	payload: Error;
};

type AddColumnFulfilled = {
	type: "boards/addColumn/fulfilled";
	payload: Column;
};

type EditColumnFulfilled = {
	type: "boards/editColumn/fulfilled";
	payload: { columnId: number; column: Column };
};
type EditColumnRejected = {
	type: "boards/editColumn/rejected";
	payload: Error;
};
type DeleteColumnFulfilled = {
	type: "boards/deleteColumn/fulfilled";
	payload: { columnId: string };
};

type AddTaskFulfilled = {
	type: "boards/addTask/fulfilled";
	payload: { columnId: number; task: Task };
};

type EditTaskFulfilled = {
	type: "boards/editTask/fulfilled";
	payload: { columnId: number; task: Task };
};
type EditTaskRejected = { type: "boards/editTask/rejected"; payload: Error };
type DeleteTaskFulfilled = {
	type: "boards/deleteTask/fulfilled";
	payload: { columnId: string; taskId: string };
};

export const fetchBoardsPending = (): FetchBoardsPending => ({
	type: "boards/fetchBoards/pending",
});
export const fetchBoardsFulfilled = (
	boards: Board[],
): FetchBoardsFulfilled => ({
	type: "boards/fetchBoards/fulfilled",
	payload: boards,
});
export const fetchBoardsRejected = (error: Error): FetchBoardsRejected => ({
	type: "boards/fetchBoards/rejected",
	payload: error,
});

export const fetchBoardPending = (): FetchBoardPending => ({
	type: "boards/fetchBoard/pending",
});
export const fetchBoardFulfilled = (board: Board): FetchBoardFulfilled => ({
	type: "boards/fetchBoard/fulfilled",
	payload: board,
});
export const fetchBoardRejected = (error: Error): FetchBoardRejected => ({
	type: "boards/fetchBoard/rejected",
	payload: error,
});

export const getBoardUsersPending = (): GetBoardUsersPending => ({
	type: "boards/getBoardUsers/pending",
});
export const getBoardUsersFulfilled = (
	users: User[],
): GetBoardUsersFulfilled => ({
	type: "boards/getBoardUsers/fulfilled",
	payload: users,
});
export const getBoardUsersRejected = (error: Error): GetBoardUsersRejected => ({
	type: "boards/getBoardUsers/rejected",
	payload: error,
});

export const addBoardFulfilled = (board: Board): AddBoardFulfilled => ({
	type: "boards/addBoard/fulfilled",
	payload: board,
});

export const editBoardFulfilled = (
	boardId: string,
	data: BoardsData,
): EditBoardFulfilled => ({
	type: "boards/editBoard/fulfilled",
	payload: { boardId, data },
});

export const editBoardRejected = (error: Error): EditBoardRejected => ({
	type: "boards/editBoard/rejected",
	payload: error,
});

export const addColumnFulfilled = (column: Column): AddColumnFulfilled => ({
	type: "boards/addColumn/fulfilled",
	payload: column,
});

export const editColumnFulfilled = (
	columnId: number,
	column: Column,
): EditColumnFulfilled => ({
	type: "boards/editColumn/fulfilled",
	payload: { columnId, column },
});
export const editColumnRejected = (error: Error): EditColumnRejected => ({
	type: "boards/editColumn/rejected",
	payload: error,
});

export const deleteColumnFulfilled = (
	columnId: string,
): DeleteColumnFulfilled => ({
	type: "boards/deleteColumn/fulfilled",
	payload: { columnId },
});

export const addTaskFulfilled = (
	columnId: number,
	task: Task,
): AddTaskFulfilled => ({
	type: "boards/addTask/fulfilled",
	payload: { columnId, task },
});

export const editTaskFulfilled = (
	columnId: number,
	task: Task,
): EditTaskFulfilled => ({
	type: "boards/editTask/fulfilled",
	payload: { columnId, task },
});
export const editTaskRejected = (error: Error): EditTaskRejected => ({
	type: "boards/editTask/rejected",
	payload: error,
});

export const deleteTaskFulfilled = (
	columnId: string,
	taskId: string,
): DeleteTaskFulfilled => ({
	type: "boards/deleteTask/fulfilled",
	payload: { columnId, taskId },
});

// ─── ASSIGNEES ──────────────────────────────────────────────

type AddAssigneeFulfilled = {
	type: "cards/addAssignee/fulfilled";
	payload: { cardId: number; user: User };
};

type RemoveAssigneeFulfilled = {
	type: "cards/removeAssignee/fulfilled";
	payload: { cardId: number; userId: number };
};

export const addAssigneeFulfilled = (
	cardId: number,
	user: User,
): AddAssigneeFulfilled => ({
	type: "cards/addAssignee/fulfilled",
	payload: { cardId, user },
});

export const removeAssigneeFulfilled = (
	cardId: number,
	userId: number,
): RemoveAssigneeFulfilled => ({
	type: "cards/removeAssignee/fulfilled",
	payload: { cardId, userId },
});

// ─── Thunks ─────────────────────────────
export function fetchBoards(): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(fetchBoardsPending());
		try {
			const boards = await api.boards.getBoards();
			dispatch(fetchBoardsFulfilled(boards));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(fetchBoardsRejected(error));
			}
		}
	};
}

export function fetchBoard(id: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(fetchBoardPending());
		try {
			const board = await api.boards.getBoard(id);
			dispatch(fetchBoardFulfilled(board));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(fetchBoardRejected(error));
			}
		}
	};
}

export function getBoardUsers(id: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		dispatch(getBoardUsersPending());
		try {
			const users = await api.boards.getBoardUsers(id);
			dispatch(getBoardUsersFulfilled(users));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(getBoardUsersRejected(error));
			}
		}
	};
}

export function addBoard(data: BoardsData): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const board = await api.boards.createBoard(data);
		dispatch(addBoardFulfilled(board));
	};
}

export function deleteBoard(boardId: string): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		await api.boards.deleteBoard(boardId);
		dispatch({ type: "boards/deleteBoards", payload: boardId });
	};
}

export function editBoard(
	boardId: string,
	data: BoardsData,
): AppThunk<Promise<void>> {
	return async function (dispatch, _getState, { api }) {
		try {
			await api.boards.updateBoard(boardId, data);
			dispatch(editBoardFulfilled(boardId, data));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(editBoardRejected(error));
			}
		}
	};
}

export function addColumn(
	boardId: string,
	data: Column,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const column = await api.boards.createColumn(boardId, data);
		dispatch(addColumnFulfilled(column));
	};
}

export function editColumn(
	columnId: number,
	data: Partial<Column>,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const updatedColumn = await api.boards.updateColumn(
				columnId.toString(),
				data,
			);
			dispatch(editColumnFulfilled(columnId, updatedColumn));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(editColumnRejected(error));
			}
		}
	};
}

export function removeColumn(columnId: string): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.deleteColumn(columnId);
		dispatch(deleteColumnFulfilled(columnId));
	};
}

export function addTask(
	columnId: number,
	data: Partial<Task>,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const task = await api.boards.createTask(columnId, data);
		dispatch(addTaskFulfilled(columnId, task));
	};
}

export function editTask(
	columnId: number,
	taskId: string,
	data: Partial<Task>,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		try {
			const updatedTask = await api.boards.updateTask(taskId, data);
			dispatch(editTaskFulfilled(columnId, updatedTask));
		} catch (error) {
			if (error instanceof Error) {
				dispatch(editTaskRejected(error));
			}
		}
	};
}

export function removeTask(
	columnId: string,
	taskId: string,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.deleteTask(taskId);
		dispatch(deleteTaskFulfilled(columnId, taskId));
	};
}

export function addAssignee(
	cardId: number,
	userId: number,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		const user = await api.boards.addAssignee(cardId, userId);
		dispatch(addAssigneeFulfilled(cardId, user));
	};
}

export function removeAssignee(
	cardId: number,
	userId: number,
): AppThunk<Promise<void>> {
	return async (dispatch, _getState, { api }) => {
		await api.boards.removeAssignee(cardId, userId);
		dispatch(removeAssigneeFulfilled(cardId, userId));
	};
}

//
// ─── UI ──────────────────────────────────────────────
//
type UiResetError = { type: "ui/reset-error" };
export const resetError = (): UiResetError => ({ type: "ui/reset-error" });

//
// ─── EXPORT TYPES ──────────────────────────────────────────────
//
export type Actions =
	| AuthLoginPending
	| AuthLoginFulfilled
	| AuthLoginRejected
	| AuthLogoutPending
	| AuthLogoutFulfilled
	| AuthLogoutRejected
	| UserUpdatePending //User
	| UserUpdateFulfilled //User
	| UserUpdateRejected //User
	| ProfileUpdatePending //Profile
	| ProfileUpdateFulfilled //Profile
	| ProfileUpdateRejected //Profile
	| ProfileLoadedFulfilled //Profile Loaded
	| ProfileLoadedPending //Profile Loaded
	| ProfileLoadedRejected //Profile Loaded
	| FetchBoardsPending
	| FetchBoardsFulfilled
	| FetchBoardsRejected
	| FetchBoardPending
	| FetchBoardFulfilled
	| FetchBoardRejected
	| AddBoardFulfilled
	| DeleteBoardFulfilled
	| EditBoardFulfilled
	| EditBoardRejected
	| AddColumnFulfilled
	| EditColumnFulfilled
	| EditColumnRejected
	| DeleteColumnFulfilled
	| AddTaskFulfilled
	| EditTaskFulfilled
	| EditTaskRejected
	| DeleteTaskFulfilled
	| GetBoardUsersPending
	| GetBoardUsersFulfilled
	| GetBoardUsersRejected
	| AddAssigneeFulfilled
	| RemoveAssigneeFulfilled
	| UiResetError;

export type ActionsRejected =
	| AuthLoginRejected
	| AuthLogoutRejected
	| UserUpdateRejected // User
	| ProfileUpdateRejected // Profile
	| ProfileLoadedRejected // Profile
	| FetchBoardsRejected
	| FetchBoardRejected
	| EditColumnRejected
	| EditTaskRejected
	| GetBoardUsersRejected;
