import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { BoardData } from "../types";
import { handleColumnDrag, handleTaskDrag } from "../lib/dragHandlers";
import Column from "./Column";

const initialData: BoardData = {
  columns: {
    "col-1": {
      id: "col-1",
      title: "Todo",
      items: [
        { id: "item-1", content: "Los meques coloraos" },
        { id: "item-2", content: "Typescript te da la vida" },
      ],
    },
    "col-2": {
      id: "col-2",
      title: "En progreso",
      items: [{ id: "item-3", content: "En mi local funciona" }],
    },
    "col-3": {
      id: "col-3",
      title: "Hecho",
      items: [],
    },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

const Board = () => {
  const [data, setData] = useState<BoardData>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { type, destination } = result;
    if (!destination) return;

    if (type === "column") {
      setData((prev) => handleColumnDrag(prev, result));
    } else {
      setData((prev) => handleTaskDrag(prev, result));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 overflow-x-auto px-4 py-8 sm:px-8"
          >
            {data.columnOrder.map((colId, index) => (
              <Draggable key={colId} draggableId={colId} index={index}>
                {(prov) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    style={prov.draggableProps.style}
                    className="flex flex-col"
                  >
                    <div {...prov.dragHandleProps}>
                      <Column column={data.columns[colId]} />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
