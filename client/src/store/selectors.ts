import type { RootState } from ".";

export const hasLogged = (state: RootState) => state.auth;

export const getUi = (state: RootState) => state.ui;

export const selectBoards = (state: RootState) => state.boards.data;
