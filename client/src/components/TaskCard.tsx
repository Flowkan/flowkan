import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../types";

interface Props {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: Props) => (
  <Draggable draggableId={task.id} index={index}>
    {(prov, snapshot) => (
      <div
        ref={prov.innerRef}
        {...prov.draggableProps}
        {...prov.dragHandleProps}
        className={`rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm transition-all duration-200 hover:bg-gray-50 ${
          snapshot.isDragging ? "bg-blue-50 ring-2 ring-blue-300 shadow-md" : ""
        }`}
        style={prov.draggableProps.style}
      >
        {task.content}
      </div>
    )}
  </Draggable>
);

export default TaskCard;
