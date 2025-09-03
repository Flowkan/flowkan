import { type RootState } from "./reducer";

export const hasLogged = (state: RootState) => state.auth;

export const getUi = (state: RootState) => state.ui;

export const selectBoards = (state: RootState) => state.boards.data;
