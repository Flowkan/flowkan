import { useState, useCallback, useEffect } from "react";
import {
	DragDropContext,
	Droppable,
	Draggable,
	type DropResult,
} from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
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
import LoginSkeleton from "../../components/ui/LoginSkeleton";

const Board = () => {
	const dispatch = useAppDispatch();
	const { boardId } = useParams<{ boardId: string }>();
	const {
		currentBoard: boardData,
		status,
		error,
	} = useAppSelector((state) => state.boards);

	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");

	useEffect(() => {
		if (boardId && boardData?.id !== boardId && status === "idle") {
			dispatch(fetchBoard(boardId));
		}
	}, [boardId, boardData?.id, status, dispatch]);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!boardData) return;
			const { type, source, destination } = result;
			if (!destination) return;

			if (type === "column") {
				// 1. Optimistic update en Redux
				const newLists = Array.from(boardData.lists);
				const [removed] = newLists.splice(source.index, 1);
				newLists.splice(destination.index, 0, removed);

				dispatch(updateColumnOrderLocal(newLists));

				// 2. Persistencia en API
				const newOrder = newLists.map((col) => col.id!.toString());
				dispatch(updateColumnOrder({ boardId: boardData.id!, newOrder }));
			} else {
				const sourceCol = boardData.lists.find(
					(c) => c.id?.toString() === source.droppableId,
				);
				const destCol = boardData.lists.find(
					(c) => c.id?.toString() === destination.droppableId,
				);
				if (!sourceCol || !destCol) return;

				const task = sourceCol.cards[source.index];

				// 1. Optimistic update
				const newSourceCards = Array.from(sourceCol.cards);
				newSourceCards.splice(source.index, 1);

				const newDestCards = Array.from(destCol.cards);
				newDestCards.splice(destination.index, 0, task);

				dispatch(
					updateColumnsLocal({
						sourceId: sourceCol.id!.toString(),
						destId: destCol.id!.toString(),
						newSourceCards,
						newDestCards,
					}),
				);

				// 2. Persistencia en API
				// Recalcular posiciones en destino
				newDestCards.forEach((t, index) => {
					dispatch(
						updateTaskThunk({
							columnId: destCol.id!.toString(),
							taskId: t.id!.toString(),
							task: {
								listId: Number(destCol.id),
								position: index,
							},
						}),
					);
				});
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

	if (status === "loading" || !boardData) return <LoginSkeleton />;
	if (error) return <div>Error al cargar el tablero: {error}</div>;

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
							{boardData.lists.map((column, index) => (
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
		</div>
	);
};

export default Board;
