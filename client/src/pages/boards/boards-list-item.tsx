import { Link } from "react-router-dom";
import type { Board } from "./types";
import TrashButton from "../../components/ui/trash-button";
import { useState } from "react";
import EditButton from "../../components/ui/edit-button";
import ConfirmDelete from "../../components/ui/confirm-delete";
import { useBoardsDeleteAction } from "../../store/hooks";
import "./boards-list-item.css";

interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const [showConfirm, setShowConfirm] = useState(false);

	const handleShowConfirm = () => setShowConfirm(true);
	const handleDeleteBoard = () => useBoardsDeleteAction();
	const handleHideMessage = () => setShowConfirm(false);

	return (
		<>
			{showConfirm && (
				<ConfirmDelete
					handleDeleteBoard={handleDeleteBoard}
					handleHideMessage={handleHideMessage}
				/>
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
						<TrashButton showConfirm={handleShowConfirm} />
					</div>
				</div>
			</li>
		</>
	);
};

export default BoardsItem;
