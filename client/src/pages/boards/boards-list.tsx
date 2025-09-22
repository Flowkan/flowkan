import BoardsItem from "./boards-list-item";
import { useState, useEffect } from "react";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { useTranslation } from "react-i18next";
import NewBoard from "../../components/ui/modals/new-board";
import { useAppSelector, useAppDispatch } from "../../store";
import { getBoardFilterCombine, getBoards } from "../../store/boards/selectors";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { fetchBoards } from "../../store/boards/actions";
import { BoardFilters } from "../../components/BoardFilters";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { SpinnerLoadingText } from "../../components/ui/Spinner";

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
	const { t } = useTranslation();
	const [showAddForm, setShowAddForm] = useState(false);
	const [searchBoard, setSearchBoard] = useState("");
	const [searchMember, setSearchMember] = useState("");
	const [skip, setSkip] = useState(0);

	const LIMIT = 10; // pendiente ajustar la cantidad según style

	const dispatch = useAppDispatch();
	const boards = useAppSelector(getBoards);
	const hasMore = boards.length > 0 && boards.length % LIMIT === 0;

	const showBoards = useAppSelector((state) =>
		getBoardFilterCombine(state, searchBoard, searchMember),
	);

	const handleShowAddForm = () => setShowAddForm(true);
	const handleCloseAddForm = () => setShowAddForm(false);
	const handleLoadMore = () => {
		setSkip((prev) => prev + LIMIT);
	};

	const loaderRef = useInfiniteScroll({
		hasMoreData: hasMore,
		fetchMoreData: handleLoadMore,
		threshold: 0,
		rootMargin: "200px",
	});

	useEffect(() => {
		dispatch(fetchBoards(skip, LIMIT));
	}, [dispatch, skip, LIMIT]);

	return (
		<>
			{showAddForm && <NewBoard onClose={handleCloseAddForm} />}
			<BackofficePage
				className="page-container"
				title={t("boardslist.title", "Mis tableros")}
			>
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
								{/* <div className="mt-6 flex justify-center text-gray-500"> */}
								{hasMore ? (
									<div ref={loaderRef}>
										<SpinnerLoadingText
											text={t(
												"boardslist.pagination.loading",
												"Cargando más",
											)}
										/>
									</div>
								) : (
									<p className="sr-only text-sm text-gray-400">
										{t(
											"boardslist.pagination.endLoading",
											"No hay más resultados.",
										)}
									</p>
								)}
								{/* </div> */}
							</div>
						</div>
					)}
				</section>
			</BackofficePage>
		</>
	);
};

export default BoardsList;
