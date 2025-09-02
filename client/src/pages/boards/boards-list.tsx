import type { Board } from "./types";
import BoardsItem from "./boards-list-item";
import { Suspense } from "react";
import LoginSkeleton from "../../components/ui/LoginSkeleton";
import AddButton from "../../components/ui/add-button";
import "./board-list.css";
import { useBoardsAction } from "../../store/hooks";
import { Page } from "../../components/layout/page";

interface BoardsListProps {
	list: Board[];
}

function EmptyList() {
	return (
		<div className="empty-list">
			<div className="p-empty-list">
				<p>Todavía no tienes ningún tablero.</p>
				<p>¿Quieres crear uno?</p>
			</div>
			<AddButton />
		</div>
	);
}

const BoardsList = () => {
	const boards = useBoardsAction();

	return (
		<Page title="Mis tableros">
			<section className="boards-list-container">
				<h2 className="sr-only">Lista de tableros</h2>
				{!boards.length ? (
					<EmptyList />
				) : (
					<div className="boards-wrapper">
						<div className="add-board-btn">
							<AddButton />
						</div>

						<div className="boards-list-content">
							<Suspense fallback={<LoginSkeleton />}>
								<ul className="boards-list">
									{boards.map((board) => (
										<BoardsItem board={board} />
									))}
								</ul>
							</Suspense>
						</div>
					</div>
				)}
			</section>
		</Page>
	);
};

export default BoardsList;
