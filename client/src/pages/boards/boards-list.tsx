import BoardsItem from "./boards-list-item";
import { Suspense, useEffect } from "react";
import LoginSkeleton from "../../components/ui/LoginSkeleton";
import AddButton from "../../components/ui/add-button";
import "./boards-list.css";
import { Page } from "../../components/layout/page";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchBoards } from "../../store/boardsSlice";

function EmptyList() {
	const { t } = useTranslation();
	return (
		<div className="empty-list">
			<div className="p-empty-list">
				<p>{t("emptylist.p1", "Todavía no tienes ningún tablero.")}</p>
				<p>{t("emptylist.p2", "¿Quieres crear uno?")}</p>
			</div>
			<AddButton />
		</div>
	);
}

const BoardsList = () => {
	const dispatch = useAppDispatch();
	const boards = useAppSelector((state) => state.boards.boards);
	const status = useAppSelector((state) => state.boards.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const { t } = useTranslation();

	useEffect(() => {
		if (status === "idle" || (status === "loading" && isAuthenticated)) {
			dispatch(fetchBoards());
		}
	}, [isAuthenticated, status, dispatch]);

	if (status === "loading") {
		return <LoginSkeleton />;
	}

	return (
		<Page title={t("boardslist.title", "Mis tableros")}>
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
										<BoardsItem key={board.id} board={board} />
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
