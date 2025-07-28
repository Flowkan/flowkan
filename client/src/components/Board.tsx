import { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import type { BoardData, Column as ColumnType, Task } from "../types";
import { handleColumnDrag, handleTaskDrag } from "../lib/dragHandlers";
import Column from "./Column";
import TaskDetailModal from "./TaskDetailModal";

const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

const initialData: BoardData = {
  columns: {
    "col-1": {
      id: "col-1",
      title: "Por hacer",
      items: [
        { id: generateUniqueId(), content: "Comprar ingredientes para la cena", description: "Revisar lista de supermercado para los ingredientes faltantes." },
        { id: generateUniqueId(), content: "Revisar pull requests pendientes" },
        { id: generateUniqueId(), content: "Planificar la reunión semanal del equipo", description: "Crear agenda y enviar invitaciones." },
      ],
    },
    "col-2": {
      id: "col-2",
      title: "En progreso",
      items: [
        { id: generateUniqueId(), content: "Diseñar wireframes para nueva feature" },
        { id: generateUniqueId(), content: "Resolver bug crítico en producción" }
      ],
    },
    "col-3": {
      id: "col-3",
      title: "Hecho",
      items: [
        { id: generateUniqueId(), content: "Configurar entorno de desarrollo" }
      ],
    },
  },
  columnOrder: ["col-1", "col-2", "col-3"],
};

const Board = () => {
  const [data, setData] = useState<BoardData>(initialData);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [newColumnIdInEdit, setNewColumnIdInEdit] = useState<string | null>(null);

  const onDragEnd = useCallback((result: DropResult) => {
    const { type, destination } = result;
    if (!destination) return;

    if (type === "column") {
      setData((prev) => handleColumnDrag(prev, result));
    } else {
      setData((prev) => handleTaskDrag(prev, result));
    }
  }, []);

  const handleAddTask = useCallback((columnId: string, content: string) => {
    setData((prevData) => {
      const newTaskId = generateUniqueId();
      const newTask: Task = { id: newTaskId, content };
      const newItems = [...prevData.columns[columnId].items, newTask];
      return {
        ...prevData,
        columns: {
          ...prevData.columns,
          [columnId]: {
            ...prevData.columns[columnId],
            items: newItems,
          },
        },
      };
    });
  }, []);

  const handleEditTask = useCallback((columnId: string, taskId: string, newContent: string, newDescription?: string) => {
    setData((prevData) => {
      const newItems = prevData.columns[columnId].items.map(task =>
        task.id === taskId ? { ...task, content: newContent, description: newDescription !== undefined ? newDescription : task.description } : task
      );
      return {
        ...prevData,
        columns: {
          ...prevData.columns,
          [columnId]: {
            ...prevData.columns[columnId],
            items: newItems,
          },
        },
      };
    });
  }, []);

  const handleDeleteTask = useCallback((columnId: string, taskId: string) => {
    setData((prevData) => {
      const newItems = prevData.columns[columnId].items.filter(task => task.id !== taskId);
      return {
        ...prevData,
        columns: {
          ...prevData.columns,
          [columnId]: {
            ...prevData.columns[columnId],
            items: newItems,
          },
        },
      };
    });
  }, []);

  const openTaskDetail = useCallback((task: Task, columnId: string) => {
    setSelectedTask(task);
    setSelectedColumnId(columnId);
  }, []);

  const closeTaskDetail = useCallback(() => {
    setSelectedTask(null);
    setSelectedColumnId(null);
  }, []);

  const handleEditColumnTitle = useCallback((columnId: string, newTitle: string) => {
    setData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [columnId]: {
          ...prevData.columns[columnId],
          title: newTitle,
        },
      },
    }));
    
    if (columnId === newColumnIdInEdit) {
      setNewColumnIdInEdit(null);
    }
  }, [newColumnIdInEdit]);

  const handleAddColumn = useCallback(() => {
    setData((prevData) => {
      const newColumnId = generateUniqueId();
      const newColumn: ColumnType = {
        id: newColumnId,
        title: "",
        items: [],
      };
      
      setNewColumnIdInEdit(newColumnId);

      return {
        ...prevData,
        columns: {
          ...prevData.columns,
          [newColumnId]: newColumn,
        },
        columnOrder: [...prevData.columnOrder, newColumnId],
      };
    });
  }, []);

  const handleDeleteColumn = useCallback((columnId: string) => {
    setData((prevData) => {
      const newColumns = { ...prevData.columns };
      delete newColumns[columnId];
      const newColumnOrder = prevData.columnOrder.filter(id => id !== columnId);
      return {
        ...prevData,
        columns: newColumns,
        columnOrder: newColumnOrder,
      };
    });
    
    if (columnId === newColumnIdInEdit) {
      setNewColumnIdInEdit(null);
    }
  }, [newColumnIdInEdit]);


  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex gap-6 overflow-x-auto px-4 py-8 sm:px-8 custom-scrollbar h-[calc(100vh-8rem)]"
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
                    <div {...prov.dragHandleProps} className="cursor-grab">
                      <Column
                        column={data.columns[colId]}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onEditColumnTitle={handleEditColumnTitle}
                        onDeleteColumn={handleDeleteColumn}
                        onOpenTaskDetail={openTaskDetail}
                        isNewColumnInEditMode={colId === newColumnIdInEdit}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="flex-shrink-0 w-80 h-full">
              <button
                onClick={handleAddColumn}
                className="bg-background-column-light text-text-placeholder p-4 rounded-lg shadow-md hover:bg-background-hover-column transition-colors duration-200 w-full h-full flex items-center justify-center text-xl font-semibold border-2 border-dashed border-border-medium hover:border-accent"
              >
                + Añadir Lista
              </button>
            </div>
          </div>
        )}
      </Droppable>

      {selectedTask && selectedColumnId && (
        <TaskDetailModal
          task={selectedTask}
          columnId={selectedColumnId}
          onClose={closeTaskDetail}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
        />
      )}
    </DragDropContext>
  );
};

export default Board;