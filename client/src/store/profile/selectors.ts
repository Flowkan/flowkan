import type { RootState } from "..";

//
// ─── PROFILE ──────────────────────────────────────────────
//
export const getUserLogged = (state: RootState) => state.auth.user;

export const getProfile = (state: RootState) => state.profile;
