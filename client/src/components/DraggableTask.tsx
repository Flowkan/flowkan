import type {
	DraggableProvided,
	DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Task } from "../pages/boards/types";
import { Avatar } from "./ui/Avatar";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";

interface DraggableTaskProps {
	provided: DraggableProvided;
	snapshot: DraggableStateSnapshot;
	task: Task;
	handleClick: () => void;
}
const DraggableTask = ({
	provided,
	snapshot,
	task,
	handleClick,
}: DraggableTaskProps) => {
	const { remoteDrag, itemDrag: taskRef } = useBoardItemSocket();

	const listRef = (el: HTMLDivElement | null) => {
		provided.innerRef(el);
		if (taskRef && snapshot.isDragging) {
			taskRef.current = el;
		}
	};

	return (
		<div
			ref={listRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			onClick={handleClick}
			className={`text-text-body mb-3 flex cursor-pointer flex-col rounded-md border-2 p-4 shadow-md transition-all duration-200 ease-in-out ${
				snapshot.isDragging
					? "bg-accent-lightest ring-accent-light shadow-lg ring-2"
					: "bg-background-card border-background-card hover:border-accent-light hover:shadow-lg"
			} ${task.id && remoteDrag?.draggableId === task.id.toString() ? "hidden" : ""} `}
			style={{ ...provided.draggableProps.style }}
		>
			<span className="text-text-heading mb-2 flex-grow pr-2 font-medium break-words">
				{task.title}
			</span>

			{(task.assignees ?? []).length > 0 && (
				<div className="flex gap-1">
					{task.assignees.map((assignee) => (
						<Avatar
							key={assignee.userId}
							name={assignee.user.name}
							photo={assignee.user.photo}
							size={24}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default DraggableTask;
