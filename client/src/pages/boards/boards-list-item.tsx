import { Link } from "react-router-dom";
import type { Board, EditBoardsData } from "./types";
import TrashButton from "../../components/ui/trash-button";
import { useState } from "react";
import EditButton from "../../components/ui/edit-button";
import ConfirmDelete from "../../components/ui/modals/confirm-delete";
import ShareBoard from "../../components/ui/modals/share-board";
import ShareIcon from "../../components/icons/share-icon.svg";
import { Button } from "../../components/ui/Button";
import "./boards-list-item.css";
import { useTranslation } from "react-i18next";
import { deleteBoard, editBoard } from "../../store/boards/actions";
import { useAppDispatch } from "../../store";
import EditBoard from "../../components/ui/modals/edit-board";
import { randomColor } from "../../lib/randomColor";

interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const [showConfirm, setShowConfirm] = useState(false);
	const [showEditForm, setShowEditForm] = useState(false);
	const [showShareForm, setShowShareForm] = useState(false);
	const dispatch = useAppDispatch();

	const handleShowConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setShowConfirm(true);
	};

	const handleDeleteBoard = async () => {
		if (board) {
			dispatch(deleteBoard(board.id));
		}
	};

	const handleHideMessage = () => setShowConfirm(false);

	const handleShowEditForm = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setShowEditForm(true);
	};

	const handleEditForm = async ({ title, image }: EditBoardsData) => {
		if (board) {
			const formData = new FormData();
			if (title) formData.append("title", title);
			if (image) formData.append("image", image);
			dispatch(editBoard(board.id, formData));
		}
	};

	const handleHideEdit = () => setShowEditForm(false);

	const handleShowShareForm = (event: React.MouseEvent<HTMLButtonElement>) => {
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
					message={t(
						"boardsitem.confirm",
						"¿Seguro que quieres borrar este tablero?",
					)}
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
				<Link to={`/boards/${board.slug}`} className="board-link">
					{board.image ? (
						<div className="img-container">
							<img
								className="board-img"
								src={`${import.meta.env.VITE_BASE_URL}${board.image}_t.webp`}
								alt="board-img"
							/>
						</div>
					) : (
						<div className="img-container">
							<div
								className="board-img"
								style={{ background: randomColor(board.title, true) }}
							></div>
						</div>
					)}
					<div className="title-actions-container">
						<div className="title-container">
							<div className="board-title">{board.title}</div>
						</div>
						<div className="edit-trash-share-wrap">
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
					</div>
				</Link>
			</li>
		</>
	);
};

export default BoardsItem;
