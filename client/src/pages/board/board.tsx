import { useEffect, useCallback, useState } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import type { Task, BoardData, Column, TaskData } from "./types";
import ColumnComponent from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import {
	useBoard,
	useBoardLoadAction,
	useColumnAddAction,
	useColumnUpdateAction,
	useColumnDeleteAction,
	useTaskAddAction,
	useTaskUpdateAction,
	useTaskDeleteAction,
} from "../../store/hooks";
import { handleColumnDrag, handleTaskDrag } from "../../lib/dragHandlers";

interface BoardProps {
	boardId: string;
}

const generateUniqueId = () =>
	Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

const Board = ({ boardId }: BoardProps) => {
	const { data: boardData, pending } = useBoard();
	const loadBoard = useBoardLoadAction();
	const addColumn = useColumnAddAction();
	const updateColumn = useColumnUpdateAction();
	const deleteColumn = useColumnDeleteAction();
	const addTask = useTaskAddAction();
	const updateTask = useTaskUpdateAction();
	const deleteTask = useTaskDeleteAction();

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");

	useEffect(() => {
		loadBoard(boardId);
	}, [boardId, loadBoard]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!boardData) return;
			const { type, source, destination } = result;
			if (!destination) return;

			if (type === "column") {
				const newBoard = handleColumnDrag(boardData, result);
				newBoard.columnOrder.forEach((colId, index) => {
					const col = newBoard.columns[colId];
					if (col.position !== index) {
						updateColumn(colId, col.title);
					}
				});
			} else {
				const newBoard = handleTaskDrag(boardData, result);
				const sourceColumn = boardData.columns[source.droppableId];
				const destColumn = boardData.columns[destination.droppableId];
				if (sourceColumn.id === destColumn.id) {
					const updatedTask = sourceColumn.items[destination.index];
					updateTask(updatedTask.id, {
						title: updatedTask.title,
						description: updatedTask.description,
					});
				} else {
					// Mover de columna a columna
					const task = sourceColumn.items[source.index];
					addTask(destination.droppableId, task);
					deleteTask(task.id);
				}
			}
		},
		[boardData, updateColumn, updateTask, addTask, deleteTask],
	);

	const handleAddTask = useCallback(
		(columnId: string, title: string) => {
			if (!boardData) return;
			const newTask: TaskData = {
				title,
				position: boardData.columns[columnId].items.length,
			};
			addTask(columnId, newTask);
		},
		[boardData, addTask],
	);

	const handleEditTask = useTaskUpdateAction();
	const handleDeleteTask = useTaskDeleteAction();

	const openTaskDetail = useCallback((task: Task, columnId: string) => {
		setSelectedTask(task);
		setSelectedColumnId(columnId);
	}, []);

	const closeTaskDetail = useCallback(() => {
		setSelectedTask(null);
		setSelectedColumnId(null);
	}, []);

	const handleEditColumnTitle = useCallback(
		(columnId: string, newTitle: string) => {
			updateColumn(columnId, newTitle);
		},
		[updateColumn],
	);

	const handleAddColumn = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	const handleCreateColumn = useCallback(() => {
		if (!boardData || newColumnName.trim() === "") return;

		addColumn({
			title: newColumnName,
			isVisible: true,
			items: [],
			position: boardData.columnOrder.length,
		});

		setNewColumnName("");
		setIsMenuOpen(false);
	}, [boardData, newColumnName, addColumn]);

	const handleDeleteColumn = useCallback(
		(columnId: string) => {
			deleteColumn(columnId);
		},
		[deleteColumn],
	);

	const handleToggleVisibility = useCallback(
		(columnId: string) => {
			if (!boardData) return;
			const col = boardData.columns[columnId];
			updateColumn(columnId, { ...col, isVisible: !col.isVisible });
		},
		[boardData, updateColumn],
	);

	if (pending || !boardData) return <div>Cargando tablero...</div>;

	return (
		<div>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="board" type="column" direction="horizontal">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="custom-scrollbar flex h-[calc(100vh-8rem)] gap-6 overflow-x-auto px-4 py-8 sm:px-8"
						>
							{boardData.columnOrder.map((colId, index) => {
								const column = boardData.columns[colId];
								if (!column.isVisible) return null;
								return (
									<Draggable key={colId} draggableId={colId} index={index}>
										{(prov) => (
											<div
												ref={prov.innerRef}
												{...prov.draggableProps}
												style={prov.draggableProps.style}
												className="flex flex-col"
											>
												<div {...prov.dragHandleProps} className="cursor-grab">
													<ColumnComponent
														column={column}
														onAddTask={handleAddTask}
														onEditTask={handleEditTask}
														onDeleteTask={handleDeleteTask}
														onEditColumnTitle={handleEditColumnTitle}
														onDeleteColumn={handleDeleteColumn}
														onOpenTaskDetail={openTaskDetail}
														isNewColumnInEditMode={false}
													/>
												</div>
											</div>
										)}
									</Draggable>
								);
							})}
							{provided.placeholder}

							<div className="items-left relative flex h-full w-80 flex-shrink-0 flex-col">
								<button
									onClick={handleAddColumn}
									className="bg-background-column-light text-text-placeholder hover:bg-background-hover-column border-border-medium hover:border-accent flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed text-2xl font-semibold shadow-md transition-colors duration-200"
								>
									+
								</button>
								{isMenuOpen && (
									<div className="bg-background-dark-footer absolute top-16 z-50 mt-2 w-full rounded-lg border border-gray-200 p-4 shadow-lg">
										<h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
											Gestionar Columnas
										</h3>
										<div className="mb-4">
											<input
												type="text"
												placeholder="Nombre de la nueva columna"
												value={newColumnName}
												onChange={(e) => setNewColumnName(e.target.value)}
												className="w-full rounded border bg-gray-100 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
											/>
											<button
												onClick={handleCreateColumn}
												className="mt-2 w-full rounded bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600"
											>
												Crear Columna
											</button>
										</div>
										<ul className="custom-scrollbar max-h-40 overflow-y-auto">
											{boardData.columnOrder.map((colId) => {
												const col = boardData.columns[colId];
												return (
													<li
														key={col.id}
														className="flex items-center justify-between py-1"
													>
														<span
															className={
																!col.isVisible
																	? "text-gray-400 italic"
																	: "text-gray-800 dark:text-gray-200"
															}
														>
															{col.title}
														</span>
														<button
															onClick={() => handleToggleVisibility(col.id)}
															className="ml-2 rounded bg-gray-200 px-2 py-1 text-sm text-gray-800 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
														>
															{col.isVisible ? "Ocultar" : "Mostrar"}
														</button>
													</li>
												);
											})}
										</ul>
									</div>
								)}
							</div>
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{selectedTask && selectedColumnId && (
				<TaskDetailModal
					task={selectedTask}
					columnId={selectedColumnId}
					onClose={closeTaskDetail}
					onEditTask={handleEditTask}
					onDeleteTask={handleDeleteTask}
				/>
			)}
		</div>
	);
};

export default Board;
