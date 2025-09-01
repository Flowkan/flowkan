import type { Board } from "./types";
import BoardsItem from "./boards-list-item";
import { Suspense } from "react";
import LoginSkeleton from "../../components/ui/LoginSkeleton";
import AddButton from "../../components/ui/add-button";

interface BoardsListProps {
	list: Board[];
}

const BoardsList = ({ list }: BoardsListProps) => {
	return (
		<div className="boards-list-wrapper">
			<div className="add-board-btn">
				<AddButton />
			</div>

			<div className="boards-list-content">
				<Suspense fallback={<LoginSkeleton />}>
					<ul className="boards-list">
						{list.map((board) => (
							<BoardsItem board={board} />
						))}
					</ul>
				</Suspense>
			</div>
		</div>
	);
};

export default BoardsList;
