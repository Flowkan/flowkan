import BoardsItem from "./boards-list-item";
import { useState, useEffect } from "react";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { useTranslation } from "react-i18next";
import NewBoard from "../../components/ui/modals/new-board";
import { useAppSelector, useAppDispatch } from "../../store";
import {
	getBoardFilterCombine,
	getBoards,
	getBoardsPagination,
} from "../../store/boards/selectors";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { fetchBoards } from "../../store/boards/actions";
import { BoardFilters } from "../../components/BoardFilters";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";
import { SpinnerLoadingText } from "../../components/ui/Spinner";

const BoardsList = () => {
	const { t } = useTranslation();
	const [showAddForm, setShowAddForm] = useState(false);
	const [searchBoard, setSearchBoard] = useState("");
	const [searchMember, setSearchMember] = useState("");
	const [page, setPage] = useState(1);

	const LIMIT = 15;

	const dispatch = useAppDispatch();
	const boards = useAppSelector(getBoards);
	const { hasMore } = useAppSelector(getBoardsPagination);

	const showBoards = useAppSelector((state) =>
		getBoardFilterCombine(state, searchBoard, searchMember),
	);

	const handleShowAddForm = () => setShowAddForm(true);
	const handleCloseAddForm = () => setShowAddForm(false);
	const handleLoadMore = () => {
		if (hasMore) {
			setPage((prev) => prev + 1);
		}
	};
	const loaderRef = useInfiniteScroll({
		hasMoreData: hasMore,
		fetchMoreData: handleLoadMore,
		threshold: 0,
		rootMargin: "200px",
	});

	useEffect(() => {
		dispatch(fetchBoards({ page, limit: LIMIT }));
	}, [dispatch, page]);

	return (
		<>
			{showAddForm && <NewBoard onClose={handleCloseAddForm} />}
			<BackofficePage className="page-container" title={t("boardsList.title")}>
				<section className="boards-list-container">
					<h2 className="sr-only">Lista de tableros</h2>
					{!boards.length ? (
						<div className="empty-list">
							<div className="p-empty-list">
								<p>{t("emptyList.p1")}</p>
								<p>{t("emptyList.p2")}</p>
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
									{[...showBoards].reverse().map((board) => (
										<BoardsItem key={board.id} board={board} />
									))}
								</ul>
								{hasMore ? (
									<div ref={loaderRef}>
										<SpinnerLoadingText
											text={t("boardsList.pagination.loading")}
										/>
									</div>
								) : (
									<p className="sr-only text-sm text-gray-400">
										{t("boardsList.pagination.endLoading")}
									</p>
								)}
							</div>
						</div>
					)}
				</section>
			</BackofficePage>
		</>
	);
};

export default BoardsList;
