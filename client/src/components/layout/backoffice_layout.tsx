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

			<main className="flex flex-1 items-center justify-center p-4">
				<div className="w-full max-w-4xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
