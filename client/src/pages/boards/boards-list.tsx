import BoardsItem from "./boards-list-item";
import { useState, useEffect } from "react";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { useTranslation } from "react-i18next";
import NewBoard from "./new-board";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchBoards } from "../../store/boardsSlice";
import { BackofficePage } from "../../components/layout/backoffice_page";

/* function EmptyList() {
	const { t } = useTranslation();
	return (
		<div className="empty-list">
			<div className="p-empty-list">
				<p>{t("emptylist.p1", "Todavía no tienes ningún tablero.")}</p>
				<p>{t("emptylist.p2", "¿Quieres crear uno?")}</p>
			</div>
			<AddButton showAddForm={} />
		</div>
	);
} */

const BoardsList = () => {
	const [showAddForm, setShowAddForm] = useState(false);
	const boards = useAppSelector((state) => state.boards.boards);
	const dispatch = useAppDispatch();
	const status = useAppSelector((state) => state.boards.status);
	const { t } = useTranslation();
	const [shouldRefetch, setShouldRefetch] = useState(false);

	const handleShowAddForm = () => setShowAddForm(true);
	const handleCloseAddForm = () => setShowAddForm(false);

	useEffect(() => {
		if (status === "idle" || shouldRefetch) {
			dispatch(fetchBoards());
			setShouldRefetch(false);
		}
	}, [shouldRefetch, status, dispatch]);

	return (
		<>
			{showAddForm && (
				<NewBoard
					onClose={handleCloseAddForm}
					onBoardCreated={() => setShouldRefetch(true)}
				/>
			)}
			<BackofficePage title={t("boardslist.title", "Mis tableros")}>
				<section className="boards-list-container">
					<h2 className="sr-only">Lista de tableros</h2>
					{!boards.length ? (
						<div className="empty-list">
							<div className="p-empty-list">
								<p>{t("emptylist.p1", "Todavía no tienes ningún tablero.")}</p>
								<p>{t("emptylist.p2", "¿Quieres crear uno?")}</p>
							</div>
							<AddButton showAddForm={handleShowAddForm} />
						</div>
					) : (
						<div className="boards-wrapper">
							<div className="add-board-btn">
								<AddButton showAddForm={handleShowAddForm} />
							</div>

							<div className="boards-list-content">
								<ul className="boards-list">
									{boards.map((board) => (
										<BoardsItem key={board.id} board={board} />
									))}
								</ul>
							</div>
						</div>
					)}
				</section>
			</BackofficePage>
		</>
	);
};

export default BoardsList;
