import { Link } from "react-router-dom";
import type { Board } from "./types";

interface BoardsListProps {
	list: Board[];
}

const BoardsList = ({ list }: BoardsListProps) => {
	return list.map((board) => (
		<li key={board.id} className="board-item">
			<Link to={`boards/${board.id}`} className="board-link">
				<span className="board-title">{board.title}</span>
			</Link>
		</li>
	));
};

export default BoardsList;
