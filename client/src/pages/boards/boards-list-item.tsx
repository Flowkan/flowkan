import { Link } from "react-router-dom";
import type { Board } from "./types";
import TrashButton from "../../components/ui/trash-button";
import { useState } from "react";
import EditButton from "../../components/ui/edit-button";
import ConfirmDelete from "./confirm-delete";
import ShareBoard from "../../components/ui/share-board";
import ShareIcon from "../../components/icons/share-icon.svg";
import { Button } from "../../components/ui/Button";
import "./boards-list-item.css";
import { useTranslation } from "react-i18next";
import { deleteBoard, editBoard } from "../../store/actions";
import { useAppDispatch } from "../../store";
import EditBoard from "./edit-board";

interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const [showConfirm, setShowConfirm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showShareForm, setShowShareForm] = useState(false);
	const dispatch = useAppDispatch();

	const handleShowConfirm = () => setShowConfirm(true);

	const handleDeleteBoard = async () => {
		if (board) {
			dispatch(deleteBoard(board.id));
		}
	};

	const handleHideMessage = () => setShowConfirm(false);

	const handleShowEditForm = () => setShowEditForm(true);

	const handleEditForm = async (newData: string) => {
		if (board) {
			dispatch(editBoard(board.id, { title: newData }));
		}
	};

	const handleHideEdit = () => setShowEditForm(false);

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
			{showEditForm && (
				<EditBoard
					handleEditForm={handleEditForm}
					handleHideMessage={handleHideEdit}
				/>
			)}
			{showShareForm && (
				<ShareBoard board={board} handleHideMessage={handleCloseShareForm} />
			)}
			<li className="board-item">
				<Link to={`/boards/${board.id}`} className="board-link">
					<div className="board-title">{board.title}</div>
				</Link>
				<div className="edit-trash">
					<div className="edit-icon container">
						<EditButton showEditForm={handleShowEditForm} />
					</div>
					<div className="trash-icon container">
						<TrashButton showConfirm={handleShowConfirm} />
					</div>

					<div className="share-icon container">
						<Button
							onClick={handleShowShareForm}
							className="share-btn"
							variant="secondary"
						>
							<img src={ShareIcon} alt="Share board" />
						</Button>
					</div>
				</div>
			</li>
		</>
	);
};

export default BoardsItem;
