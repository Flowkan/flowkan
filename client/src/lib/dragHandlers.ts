import type { DropResult } from "@hello-pangea/dnd";
import type { BoardData, Column } from "../types";

// Maneja el movimiento de columnas
export function handleColumnDrag(
  data: BoardData,
  result: DropResult,
): BoardData {
  const newOrder = [...data.columnOrder];
  const [removed] = newOrder.splice(result.source.index, 1);
  newOrder.splice(result.destination!.index, 0, removed);
  return { ...data, columnOrder: newOrder };
}

// Maneja el movimiento de tareas
export function handleTaskDrag(data: BoardData, result: DropResult): BoardData {
  const { source, destination } = result;
  const startCol = data.columns[source.droppableId];
  const finishCol = data.columns[destination!.droppableId];

  if (startCol === finishCol) {
    const newItems = [...startCol.items];
    const [moved] = newItems.splice(source.index, 1);
    newItems.splice(destination!.index, 0, moved);
    const newCol: Column = { ...startCol, items: newItems };
    return {
      ...data,
      columns: { ...data.columns, [newCol.id]: newCol },
    };
  } else {
    const startItems = [...startCol.items];
    const [moved] = startItems.splice(source.index, 1);
    const finishItems = [...finishCol.items];
    finishItems.splice(destination!.index, 0, moved);

    const newStart: Column = { ...startCol, items: startItems };
    const newFinish: Column = { ...finishCol, items: finishItems };

    return {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
  }
}
