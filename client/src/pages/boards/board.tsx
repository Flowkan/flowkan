import { useState, useCallback, useEffect } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
	type DraggableLocation,
} from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import type { Task, Column as ColumnType } from "./types";
import {
	fetchBoard,
	updateColumnOrder,
	addBoardColumn,
	updateColumnThunk,
	deleteColumnThunk,
	addTask,
	updateTaskThunk,
	deleteTaskThunk,
	updateColumnsLocal,
	updateColumnOrderLocal,
} from "../../store/boardsSlice";
import { BackofficePage } from "../../components/layout/backoffice_page";

const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const move = <T,>(
	source: T[],
	destination: T[],
	droppableSource: DraggableLocation,
	droppableDestination: DraggableLocation,
): { [key: string]: T[] } => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result: { [key: string]: T[] } = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

const Board = () => {
	const dispatch = useAppDispatch();
	const { boardId } = useParams<{ boardId: string }>();
	const navigate = useNavigate();
	const { currentBoard: boardData, error } = useAppSelector(
		(state) => state.boards,
	);

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");

	useEffect(() => {
		if (boardId) {
			dispatch(fetchBoard(boardId));
		}
	}, [boardId, dispatch]);

	useEffect(() => {
		if (error === "Error al cargar tablero") {
			navigate("/404");
		}
	}, [error, navigate]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!boardData) return;
			const { type, source, destination } = result;
			if (!destination) return;

			// Si el arrastre es de una columna a otra
			if (type === "column") {
				const newLists = reorder(
					boardData.lists,
					source.index,
					destination.index,
				);
				dispatch(updateColumnOrderLocal(newLists));
				const newOrder = newLists.map((col) => col.id!.toString());
				dispatch(updateColumnOrder({ boardId: boardData.id!, newOrder }));
			} else {
				// Si el arrastre es de una tarjeta
				const sInd = source.droppableId;
				const dInd = destination.droppableId;

				const sourceCol = boardData.lists.find(
					(c) => c.id?.toString() === sInd,
				);
				const destCol = boardData.lists.find((c) => c.id?.toString() === dInd);
				if (!sourceCol || !destCol) return;

				let newSourceCards;
				let newDestCards;

				if (sInd === dInd) {
					// Mover dentro de la misma lista
					newSourceCards = reorder(
						sourceCol.cards,
						source.index,
						destination.index,
					);
					newDestCards = newSourceCards;
				} else {
					// Mover entre listas diferentes
					const result = move(
						sourceCol.cards,
						destCol.cards,
						source,
						destination,
					);
					newSourceCards = result[sInd];
					newDestCards = result[dInd];
				}

				// 1. Actualización optimista en Redux
				dispatch(
					updateColumnsLocal({
						sourceId: sInd,
						destId: dInd,
						newSourceCards,
						newDestCards,
					}),
				);

				// 2. Persistencia en la API
				// Recalcula y actualiza las posiciones de las tarjetas en la lista de destino.
				newDestCards.forEach((t, index) => {
					dispatch(
						updateTaskThunk({
							columnId: dInd,
							taskId: t.id!.toString(),
							task: {
								listId: Number(dInd),
								position: index,
							},
						}),
					);
				});

				// Si el movimiento fue entre listas, actualiza también la lista de origen.
				if (sInd !== dInd) {
					newSourceCards.forEach((t, index) => {
						dispatch(
							updateTaskThunk({
								columnId: sInd,
								taskId: t.id!.toString(),
								task: {
									listId: Number(sInd),
									position: index,
								},
							}),
						);
					});
				}
			}
		},
		[boardData, dispatch],
	);

	const handleAddTask = useCallback(
		(columnId: number, content: string) => {
			if (!boardData) return;
			const currentColumn = boardData.lists.find(
				(c) => c.id?.toString() === columnId.toString(),
			);
			if (!currentColumn) return;
			const newTask = {
				title: content,
				description: "",
				position: (currentColumn.cards ?? []).length,
			};

			dispatch(
				addTask({
					boardId: boardData.id!,
					columnId: columnId,
					task: newTask,
				}),
			);
		},
		[boardData, dispatch],
	);

	const handleEditTask = useCallback(
		(
			columnId: string,
			taskId: string,
			newContent: string,
			newDescription?: string,
		) => {
			dispatch(
				updateTaskThunk({
					columnId,
					taskId,
					task: { title: newContent, description: newDescription },
				}),
			);
		},
		[dispatch],
	);

	const handleDeleteTask = useCallback(
		(taskId: string, columnId: string) => {
			if (!boardData) return;
			dispatch(deleteTaskThunk({ boardId: boardData.id!, columnId, taskId }));
		},
		[boardData, dispatch],
	);

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
			if (!boardData) return;
			const column = boardData.lists.find((c) => c.id === columnId);
			if (!column) return;
			dispatch(
				updateColumnThunk({
					columnId,
					data: { ...column, title: newTitle },
				}),
			);
		},
		[boardData, dispatch],
	);

	const handleAddColumnToggle = useCallback(() => {
		setIsMenuOpen((prev) => !prev);
	}, []);

	const handleCreateColumn = useCallback(() => {
		if (newColumnName.trim() !== "" && boardData) {
			const newColumn: ColumnType = {
				title: newColumnName,
				cards: [],
				isVisible: true,
				position: boardData.lists.length,
			};
			dispatch(addBoardColumn({ boardId: boardData.id!, column: newColumn }));
			setNewColumnName("");
			setIsMenuOpen(false);
		}
	}, [boardData, newColumnName, dispatch]);

	const handleDeleteColumnClick = useCallback(
		(columnId: string) => {
			if (!boardData) return;
			dispatch(deleteColumnThunk({ columnId }));
		},
		[boardData, dispatch],
	);

	if (error) return <div>Error al cargar el tablero: {error}</div>;

	return (
		<BackofficePage>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="board" type="column" direction="horizontal">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="custom-scrollbar flex h-[calc(100vh-8rem)] gap-6 overflow-x-auto px-4 py-8 sm:px-8"
						>
							{boardData?.lists.map((column, index) => (
								<Draggable
									key={column.id}
									draggableId={column.id!.toString()}
									index={index}
								>
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
													onAddTask={(task) =>
														handleAddTask(Number(column.id), task)
													}
													onEditTask={(taskId, newTitle, newDescription) =>
														handleEditTask(
															column.id!,
															taskId,
															newTitle,
															newDescription,
														)
													}
													onDeleteTask={(taskId) =>
														handleDeleteTask(taskId, column.id!)
													}
													onEditColumnTitle={(newTitle) =>
														handleEditColumnTitle(column.id!, newTitle)
													}
													onDeleteColumn={() =>
														handleDeleteColumnClick(column.id!)
													}
													onOpenTaskDetail={(task) =>
														openTaskDetail(task, column.id!)
													}
													isNewColumnInEditMode={false}
												/>
											</div>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}

							{/* Add new column */}
							<div className="items-left relative flex h-full w-80 flex-shrink-0 flex-col">
								<button
									onClick={handleAddColumnToggle}
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
					onEditTask={(title, desc) =>
						handleEditTask(
							selectedColumnId,
							selectedTask.id!.toString(),
							title,
							desc,
						)
					}
					onDeleteTask={() =>
						handleDeleteTask(selectedTask.id!.toString(), selectedColumnId)
					}
				/>
			)}
		</BackofficePage>
	);
};

export default Board;
