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
			isVisible: true,
			items: [
				{
					id: generateUniqueId(),
					content: "Comprar ingredientes para la cena",
					description:
						"Revisar lista de supermercado para los ingredientes faltantes.",
				},
				{ id: generateUniqueId(), content: "Revisar pull requests pendientes" },
				{
					id: generateUniqueId(),
					content: "Planificar la reunión semanal del equipo",
					description: "Crear agenda y enviar invitaciones.",
				},
			],
		},
		"col-2": {
			id: "col-2",
			title: "En progreso",
			isVisible: true,
			items: [
				{
					id: generateUniqueId(),
					content: "Diseñar wireframes para nueva feature",
				},
				{
					id: generateUniqueId(),
					content: "Resolver bug crítico en producción",
				},
			],
		},
		"col-3": {
			id: "col-3",
			title: "Hecho",
			isVisible: true,
			items: [
				{ id: generateUniqueId(), content: "Configurar entorno de desarrollo" },
			],
		},
	},
	columnOrder: ["col-1", "col-2", "col-3"],
};

const Board = () => {
	const [data, setData] = useState<BoardData>(initialData);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [newColumnIdInEdit, setNewColumnIdInEdit] = useState<string | null>(
		null,
	);

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");

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

	const handleEditTask = useCallback(
		(
			columnId: string,
			taskId: string,
			newContent: string,
			newDescription?: string,
		) => {
			setData((prevData) => {
				const newItems = prevData.columns[columnId].items.map((task) =>
					task.id === taskId
						? {
								...task,
								content: newContent,
								description:
									newDescription !== undefined
										? newDescription
										: task.description,
							}
						: task,
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
		},
		[],
	);

	const handleDeleteTask = useCallback((columnId: string, taskId: string) => {
		setData((prevData) => {
			const newItems = prevData.columns[columnId].items.filter(
				(task) => task.id !== taskId,
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
		},
		[newColumnIdInEdit],
	);

	const handleAddColumn = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	const handleCreateColumn = useCallback(() => {
		if (newColumnName.trim() !== "") {
			const newColumnId = generateUniqueId();
			const newColumn: ColumnType = {
				id: newColumnId,
				title: newColumnName,
				items: [],
				isVisible: true,
			};

			setData((prevData) => ({
				...prevData,
				columns: {
					...prevData.columns,
					[newColumnId]: newColumn,
				},
				columnOrder: [...prevData.columnOrder, newColumnId],
			}));

			setNewColumnName("");
			setIsMenuOpen(false);
		}
	}, [newColumnName]);

	const handleDeleteColumn = useCallback(
		(columnId: string) => {
			setData((prevData) => {
				const newColumns = { ...prevData.columns };
				delete newColumns[columnId];
				const newColumnOrder = prevData.columnOrder.filter(
					(id) => id !== columnId,
				);
				return {
					...prevData,
					columns: newColumns,
					columnOrder: newColumnOrder,
				};
			});

			if (columnId === newColumnIdInEdit) {
				setNewColumnIdInEdit(null);
			}
		},
		[newColumnIdInEdit],
	);

	const handleToggleVisibility = useCallback((columnId: string) => {
		setData((prevData) => ({
			...prevData,
			columns: {
				...prevData.columns,
				[columnId]: {
					...prevData.columns[columnId],
					isVisible: !prevData.columns[columnId].isVisible,
				},
			},
		}));
	}, []);

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
							{data.columnOrder.map((colId, index) => {
								const column = data.columns[colId];
								return column.isVisible ? (
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
														column={column}
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
								) : null;
							})}
							{provided.placeholder}
							{/* Contenedor del botón y menú, ahora al inicio del div */}
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
											{data.columnOrder.map((colId) => {
												const col = data.columns[colId];
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
