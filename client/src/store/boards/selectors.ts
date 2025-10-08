import type { RootState } from "..";

//
// ─── BOARDS ──────────────────────────────────────────────
//

export const getBoards = (state: RootState) => state.boards.boards;
export const getBoardsPagination = (state: RootState) => ({
	currentPage: state.boards.currentPage,
	totalPages: state.boards.totalPages,
	hasMore: state.boards.hasMore,
});

export const getBoardsByTitle = (state: RootState, seachTitle: string) =>
	state.boards.boards.filter((board) =>
		board.title.toLowerCase().includes(seachTitle.toLowerCase()),
	);
export const getAllMembers = (state: RootState) => {
	const boards = state.boards.boards ?? [];
	const members: { name: string; photo: string }[] = [];

	boards.forEach((board) => {
		board.members?.forEach((member) => {
			const name = member.user?.name;
			if (!name) return;

			const photo = member.user?.photo ?? "";

			const exists = members.find((m) => m.name === name);
			if (!exists) {
				members.push({ name, photo });
			}
		});
	});

	return members;
};

export const getBoardByMember = (state: RootState, searchMember: string) => {
	return state.boards.boards.filter((board) =>
		board.members.some((member) =>
			member.user.name.toLowerCase().includes(searchMember.toLowerCase()),
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
