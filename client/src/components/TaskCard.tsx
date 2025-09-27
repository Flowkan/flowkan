import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../pages/boards/types";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";
import DraggableTask from "./DraggableTask";

interface Props {
	task: Task;
	index: number;
	columnId: string;
	onEditTask: (updatedFields: { title?: string; description?: string }) => void;
	onDeleteTask: (columnId: string, taskId: string) => void;
	onOpenTaskDetail: (task: Task, columnId: string) => void;
}

const TaskCard = ({ task, index, columnId, onOpenTaskDetail }: Props) => {
	const handleClick = () => {
		onOpenTaskDetail(task, columnId);
	};
	const { remoteDrag } = useBoardItemSocket();

	if (task.id === undefined) return null;

	return (
		<Draggable
			draggableId={task.id.toString()}
			index={index}
			isDragDisabled={remoteDrag?.draggableId === task.id.toString()}
		>
			{(provided, snapshot) => (
				<DraggableTask
					provided={provided}
					snapshot={snapshot}
					task={task}
					handleClick={handleClick}
				/>
			)}
		</Draggable>
	);
};

export default TaskCard;
