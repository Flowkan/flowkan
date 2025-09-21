import { Outlet, useParams, useLocation } from "react-router-dom";
import { BoardToolbar } from "./BoardToolbar";
import { BackofficeHeader } from "./backoffice_header";
import { useBoards } from "../../store/hooks";

export function BackofficeLayout() {
	const { slug } = useParams<{ slug: string }>();
	const location = useLocation();

	const allBoards = useBoards();
	let boardId;
	if (allBoards.length > 0) {
		const foundBoard = allBoards.find((b) => b.slug === slug);

		if (foundBoard) {
			boardId = foundBoard.id.toString();
		}
	}

	const isBoardPage =
		location.pathname.startsWith("/boards/") && boardId !== undefined;

	return (
		<div className="flex min-h-screen flex-col">
			<BackofficeHeader />

			{isBoardPage && (
				<BoardToolbar
					board={{
						id: boardId ?? "",
						title: "",
						slug: "",
						lists: [],
						members: [],
					}}
				/>
			)}

			<main className="flex-1 p-4">
				<Outlet />
			</main>
		</div>
	);
}
