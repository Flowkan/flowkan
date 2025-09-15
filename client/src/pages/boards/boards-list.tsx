import BoardsItem from "./boards-list-item";
import { useState, useEffect } from "react";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { useTranslation } from "react-i18next";
import NewBoard from "./new-board";
import { useAppSelector, useAppDispatch } from "../../store";
import { getBoardFilterCombine, getBoards } from "../../store/selectors";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { fetchBoards } from "../../store/actions";
import { BoardFilters } from "../../components/BoardFilters";

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
	const [searchBoard, setSearchBoard] = useState("");
	const [searchMember, setSearchMember] = useState("");

	const { t } = useTranslation();

	const handleShowAddForm = () => setShowAddForm(true);
	const handleCloseAddForm = () => setShowAddForm(false);

	const dispatch = useAppDispatch();
	const boards = useAppSelector(getBoards);

	const showBoards = useAppSelector((state) =>
		getBoardFilterCombine(state, searchBoard, searchMember),
	);

	useEffect(() => {
		dispatch(fetchBoards());
	}, [dispatch]);

	return (
		<>
			{showAddForm && (
				<NewBoard onClose={handleCloseAddForm} onBoardCreated={() => {}} />
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
							{/* Barra de herramientas con botones alineados */}
							<div className="boards-toolbar">
								<AddButton showAddForm={handleShowAddForm} />
								<BoardFilters
									searchBoard={searchBoard}
									searchMember={searchMember}
									setSearchBoard={setSearchBoard}
									setSearchMember={setSearchMember}
								/>
							</div>
							<div className="boards-list-content">
								<ul className="boards-list">
									{showBoards.map((board) => (
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
