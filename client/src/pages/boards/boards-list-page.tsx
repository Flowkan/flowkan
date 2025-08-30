import { lazy, Suspense } from "react";
import { useBoardsAction } from "../../store/hooks";
import { Page } from "../../components/layout/page";
import LoginSkeleton from "../../components/ui/LoginSkeleton";

const BoardsList = lazy(() => import("./boards-list"));

function EmptyList() {
	return (
		<div className="empty-list">
			<p>Todavía no tienes ningún tablero</p>
			<p>¿Quieres crear una?</p>
			<button>NUEVO TABLERO</button>
		</div>
	);
}

function BoardsListPage() {
	const boards = useBoardsAction();

	return (
		<Page title="Mis tableros">
			<section>
				{!boards.length ? (
					<EmptyList />
				) : (
					<Suspense fallback={<LoginSkeleton />}>
						<BoardsList list={boards} />
					</Suspense>
				)}
			</section>
		</Page>
	);
}

export default BoardsListPage;
