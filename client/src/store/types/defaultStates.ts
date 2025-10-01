import type { Board } from "../../pages/boards/types";
import type { User } from "../../pages/login/types";
import type { ProfileType } from "../../pages/profile/types";

export type AuthState = {
	auth: {
		user: User | null;
		isAuthenticated: boolean;
		error: string | null;
	};
	ui: {
		pending: boolean;
		error: Error | null;
	};
};

export type ProfileState = {
	profile: ProfileType | null;
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

export type BoardsState = {
	auth: {
		user: User | null;
		isAuthenticated: boolean;
		error: string | null;
	};
	profile: ProfileType | null;
	boards: {
		boards: Board[];
		currentBoard: Board | null;
		loading: boolean;
		error: string | null;
		currentPage: number;
		totalPages: number;
		totalCount: number;
		hasMore: boolean;
	};
	ui: {
		pending: boolean;
		error: Error | null;
	};
};
