import { Droppable } from "@hello-pangea/dnd";
import type { Column as ColumnType } from "../types";
import TaskCard from "./TaskCard";

interface Props {
  column: ColumnType;
}

const Column = ({ column }: Props) => (
  <div className="flex h-fit min-w-[280px] max-w-xs flex-col rounded-xl border border-gray-200 bg-white shadow-md transition hover:shadow-lg">
    <div className="rounded-t-xl bg-gray-100 px-4 py-3">
      <h3 className="text-sm font-semibold text-gray-700">{column.title}</h3>
    </div>

    <Droppable droppableId={column.id} type="task">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-3 px-4 py-4"
        >
          {column.items.map((item, index) => (
            <TaskCard key={item.id} task={item} index={index} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </div>
);

export default Column;
