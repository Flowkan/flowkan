import type { RootState } from "..";

//
// ─── BOARDS ──────────────────────────────────────────────
//

export const getBoards = (state: RootState) => state.boards.boards;
export const getBoardsPagination = (state: RootState) => ({
  currentPage: state.boards.currentPage,
  totalPages: state.boards.totalPages,
  totalCount: state.boards.totalCount,
  hasMore: state.boards.hasMore,
});

export const getBoardsByTitle = (state: RootState, seachTitle: string) =>
	state.boards.boards.filter((b) =>
		b.title.toLowerCase().includes(seachTitle.toLowerCase()),
	);

export const getBoardByMember = (state: RootState, searchMember: string) => {
	if (searchMember.includes("@")) {
		return state.boards.boards.filter((b) =>
			b.members.some((m) =>
				m.user.email.toLowerCase().includes(searchMember.toLowerCase()),
			),
		);
	}
	return state.boards.boards.filter((b) =>
		b.members.some(
			(m) =>
				m.user.name.toLowerCase().includes(searchMember.toLowerCase()) ||
				m.user.email.toLowerCase().includes(searchMember.toLowerCase()),
		),
	);
};

export const getBoardFilterCombine = (
	state: RootState,
	searchTitle: string,
	searchMember: string,
) => {
	if (searchTitle && searchMember) {
		const boardTitle = getBoardsByTitle(state, searchTitle);
		const boardMember = getBoardByMember(state, searchMember);

		return boardTitle.filter((board) =>
			boardMember.some((memberBoard) => memberBoard.id === board.id),
		);
	}
	if (searchTitle) return getBoardsByTitle(state, searchTitle);
	if (searchMember) return getBoardByMember(state, searchMember);
	return getBoards(state);
};

export const getCurrentBoard = (state: RootState) => state.boards.currentBoard;

export const getBoardsLoading = (state: RootState) => state.boards.loading;

export const getBoardsError = (state: RootState) => state.boards.error;

//
// ─── UI ──────────────────────────────────────────────
//

export const getUi = (state: RootState) => state.ui;

export const getUiPending = (state: RootState) => state.ui.pending;

export const getUiError = (state: RootState) => state.ui.error;
