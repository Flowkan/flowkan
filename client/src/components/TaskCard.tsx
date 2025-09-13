import { Draggable } from "@hello-pangea/dnd";
import { Avatar } from "./ui/Avatar";
import type { Task } from "../pages/boards/types";

interface Props {
	task: Task;
	index: number;
	columnId: string;
	onEditTask: (
		columnId: string,
		taskId: string,
		newContent: string,
		newDescription?: string,
	) => void;
	onDeleteTask: (columnId: string, taskId: string) => void;
	onOpenTaskDetail: (task: Task, columnId: string) => void;
}

const TaskCard = ({ task, index, columnId, onOpenTaskDetail }: Props) => {
	const handleClick = () => {
		onOpenTaskDetail(task, columnId);
	};

	if (task.id === undefined) return null;

	return (
		<Draggable draggableId={task.id.toString()} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					onClick={handleClick}
					className={`text-text-body mb-3 flex cursor-pointer flex-col rounded-md border-2 p-4 shadow-md transition-all duration-200 ease-in-out ${
						snapshot.isDragging
							? "bg-accent-lightest ring-accent-light shadow-lg ring-2"
							: "bg-background-card border-background-card hover:border-accent-light hover:shadow-lg"
					}`}
					style={{ ...provided.draggableProps.style }}
				>
					<span className="text-text-heading mb-2 flex-grow pr-2 font-medium break-words">
						{task.title}
					</span>

					{task.assignees.length > 0 && (
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
			)}
		</Draggable>
	);
};

export default TaskCard;
