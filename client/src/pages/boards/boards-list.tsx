import type { Board } from "./types";

interface BoardsListProps {
	list: Board[];
}

const BoardsList = ({ list }: BoardsListProps) => {
	return list.map((board) => <li key={board.id}></li>);
};

export default BoardsList;
