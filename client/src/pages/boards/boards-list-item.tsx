import { Link } from "react-router-dom";
import type { Board } from "./types";
import TrashButton from "../../components/ui/trash-button";
import { useState } from "react";
import EditButton from "../../components/ui/edit-button";

interface BoardsItemProps {
	board: Board;
}

const BoardsItem = ({ board }: BoardsItemProps) => {
	const [showConfirm, setShowConfirm] = useState(false);
	// TODO: el showConfirm tiene que ser un estado global porque el mensaje sale en la pagina boards-list

	const handleShowConfirm = () => setShowConfirm(true);

	return (
		<li key={board.id} className="board-item">
			<Link to={`/boards/${board.id}`} className="board-link">
				<div className="board-title">{board.title}</div>
				<div className="edit-trash">
					<div className="edit-container">
						<TrashButton showConfirm={handleShowConfirm} />
					</div>
					<div className="trash-container">
						<EditButton />
					</div>
				</div>
			</Link>
		</li>
	);
};

export default BoardsItem;
