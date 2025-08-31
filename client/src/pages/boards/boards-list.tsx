import type { Board } from "./types";
import BoardsItem from "./boards-list-item";

interface BoardsListProps {
	list: Board[];
}

const BoardsList = ({ list }: BoardsListProps) => {
	return (
		<ul className="boards-list">
			{list.map((board) => (
				<BoardsItem board={board} />
			))}
		</ul>
	);
};

export default BoardsList;
