import { Link } from "react-router-dom";
import type { Board } from "./types";
import TrashButton from "../../components/ui/trash-button";
import { useState } from "react";
import EditButton from "../../components/ui/edit-button";
import ConfirmDelete from "../../components/ui/confirm-delete";
import ShareBoard from "../../components/ui/share-board";
import ShareButton from "../../components/ui/share-button";
import "./boards-list-item.css";
import { useTranslation } from "react-i18next";

interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const [showConfirm, setShowConfirm] = useState(false);
	const [showShareForm, setShowShareForm] = useState(false);

	const handleShowConfirm = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowConfirm(true);
	};

	const handleDeleteBoard = () => {};
	const handleHideMessage = () => setShowConfirm(false);

	const handleShowShareForm = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowShareForm(true);
	};

	const handleCloseShareForm = () => setShowShareForm(false);

	const { t } = useTranslation();

	return (
		<>
			{showConfirm && (
				<ConfirmDelete
					handleDeleteBoard={handleDeleteBoard}
					handleHideMessage={handleHideMessage}
					message={t("boardsitem.confirm")}
				/>
			)}
			{showShareForm && (
				<ShareBoard board={board} onClose={handleCloseShareForm} />
			)}
			<li className="board-item">
				<Link to={`/boards/${board.id}`} className="board-link">
					<div className="board-title">{board.title}</div>
				</Link>
				<div className="edit-trash">
					<div className="edit-icon container">
						<EditButton />
					</div>
					<div className="trash-icon container">
						<TrashButton showConfirm={() => handleShowConfirm} />
					</div>

					<div className="share-icon container">
						<ShareButton showShareForm={handleShowShareForm} />
					</div>
				</div>
			</li>
		</>
	);
};

export default BoardsItem;
