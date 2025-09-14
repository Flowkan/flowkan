import BoardsItem from "./boards-list-item";
import { useState, useEffect, type ChangeEvent } from "react";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { useTranslation } from "react-i18next";
import NewBoard from "./new-board";
import { useAppSelector, useAppDispatch } from "../../store";
import { getBoardFilterCombine, getBoards } from "../../store/selectors";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { fetchBoards } from "../../store/actions";
import { FormFields } from "../../components/ui/FormFields";

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
	const [searchUser, setSearchUser] = useState("");

	const { t } = useTranslation();

	const handleShowAddForm = () => setShowAddForm(true);
	const handleCloseAddForm = () => setShowAddForm(false);

	const dispatch = useAppDispatch();
	const boards = useAppSelector(getBoards);

	const showBoards = useAppSelector((state) =>
		getBoardFilterCombine(state, searchBoard, searchUser),
	);

	const handleFilterByTitle = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchBoard(value);
	};

	const handlerFilterMember = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchUser(value);
	};

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
							<div className="add-board-btn">
								<AddButton showAddForm={handleShowAddForm} />
							</div>

							{/* Filtra tablero por titulo */}
							<FormFields
								type="text"
								id="filterBoard"
								name="filterBoard"
								placeholder={t(
									"boardslist.filter.nameBoard",
									"Buscar tableros...",
								)}
								value={searchBoard}
								onChange={handleFilterByTitle}
								className="w-56 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>

							{/* Filtra por nombre y email */}
							<FormFields
								type="text"
								id="filterUser"
								name="filterUSer"
								placeholder={t(
									"boardslist.filter.userOrEmail",
									"Filtrar por nombre o email...",
								)}
								onChange={handlerFilterMember}
							/>

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
