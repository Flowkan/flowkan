import { Draggable } from "@hello-pangea/dnd";
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

	if (task.id === undefined) {
		return null;
	}

	return (
		<Draggable draggableId={task.id?.toString()} index={index}>
			{(provided, snapshot) => (
				<div
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					onClick={handleClick}
					className={`text-text-body mb-3 flex cursor-pointer items-center justify-between rounded-md border-2 p-4 shadow-md transition-all duration-200 ease-in-out ${
						snapshot.isDragging
							? "bg-accent-lightest ring-accent-light shadow-lg ring-2"
							: "bg-background-card border-background-card hover:border-accent-light hover:shadow-lg" // Añadido hover
					} `}
					style={{ ...provided.draggableProps.style }}
				>
					<span className="text-text-heading flex-grow pr-2 font-medium break-words">
						{task.title}
					</span>
				</div>
			)}
		</Draggable>
	);
};

export default TaskCard;
