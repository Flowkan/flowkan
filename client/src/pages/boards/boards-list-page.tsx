import { lazy } from "react";
import { useBoardsAction } from "../../store/hooks";
import { Page } from "../../components/layout/page";

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
				<h2 className="sr-only">Lista de tableros</h2>
				{!boards.length ? <EmptyList /> : <BoardsList list={boards} />}
			</section>
		</Page>
	);
}

export default BoardsListPage;
