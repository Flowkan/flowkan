import type { RootState } from ".";

//
// ─── AUTH ──────────────────────────────────────────────
//
export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const getAuthError = (state: RootState) => state.auth.error;

//
// ─── BOARDS ──────────────────────────────────────────────
//
export const getBoards = (state: RootState) => state.boards.boards;

export const getBoardsByTitle = (state: RootState, title: string) => state.boards.boards.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));

export const getCurrentBoard = (state: RootState) => state.boards.currentBoard;

export const getBoardsLoading = (state: RootState) => state.boards.loading;

export const getBoardsError = (state: RootState) => state.boards.error;

//
// ─── UI ──────────────────────────────────────────────
//
export const getUi = (state: RootState) => state.ui;

export const getUiPending = (state: RootState) => state.ui.pending;

export const getUiError = (state: RootState) => state.ui.error;
