import type { RootState } from ".";

//
// ─── AUTH ──────────────────────────────────────────────
//
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const getAuthError = (state: RootState) => state.auth.error;

//
// ─── PROFILE ──────────────────────────────────────────────
//
export const getUserLogged = (state:RootState) => state.auth.user;

export const getProfile = (state:RootState) => state.profile;

//
// ─── BOARDS ──────────────────────────────────────────────
//
export const getBoards = (state: RootState) => state.boards.boards;

export const getCurrentBoard = (state: RootState) => state.boards.currentBoard;

export const getBoardsLoading = (state: RootState) => state.boards.loading;

export const getBoardsError = (state: RootState) => state.boards.error;

//
// ─── UI ──────────────────────────────────────────────
//
export const getUi = (state: RootState) => state.ui;

export const getUiPending = (state: RootState) => state.ui.pending;

export const getUiError = (state: RootState) => state.ui.error;
