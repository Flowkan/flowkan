import type { RootState } from "..";

//
// ─── AUTH ──────────────────────────────────────────────
//

export const isAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const getAuthError = (state: RootState) => state.auth.error;