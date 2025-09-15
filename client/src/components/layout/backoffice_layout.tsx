import { Outlet, useParams, useLocation } from "react-router-dom";
import { BoardToolbar } from "./BoardToolbar";
import { BackofficeHeader } from "./backoffice_header";

export function BackofficeLayout() {
	const { boardId } = useParams();
	const location = useLocation();

	const isBoardPage = location.pathname.startsWith("/boards/") && boardId;

	return (
		<div className="flex min-h-screen flex-col">
			<BackofficeHeader />

			{isBoardPage && (
				<BoardToolbar
					board={{
						id: boardId,
						title: "",
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
