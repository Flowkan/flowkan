import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types";

interface Props {
  task: Task;
  index: number;
  columnId: string;
  onEditTask: (columnId: string, taskId: string, newContent: string, newDescription?: string) => void;
  onDeleteTask: (columnId: string, taskId: string) => void;
  onOpenTaskDetail: (task: Task, columnId: string) => void;
}

const TaskCard = ({ task, index, columnId, onOpenTaskDetail }: Props) => {
  const handleClick = () => {
    onOpenTaskDetail(task, columnId);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          className={`
            rounded-md shadow-md p-4 mb-3 cursor-pointer
            flex justify-between items-center text-text-body
            border-2 transition-all duration-200 ease-in-out
            ${snapshot.isDragging
              ? "bg-accent-lightest ring-2 ring-accent-light shadow-lg"
              : "bg-background-card border-background-card hover:border-accent-light hover:shadow-lg" // Añadido hover
            }
          `}
          style={{ ...provided.draggableProps.style }}
        >
          <span className="flex-grow pr-2 break-words text-text-heading font-medium">{task.content}</span>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;