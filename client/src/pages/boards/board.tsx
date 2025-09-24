import { useState, useCallback, useEffect } from "react";
import {
	DragDropContext,
	Droppable,
	type DropResult,	
} from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import type { Task, Column as ColumnType, Board } from "./types";
import {
	useFetchBoardByIdAction,
	useAddTaskAction,
	useUpdateTaskAction,
	useCurrentBoard,
	useBoardsError,
	useAddColumnAction,
	useDeleteColumnAction,
	useDeleteTaskction,
	useUpdateColumnAction,
	useUpdateBoardRemote,
} from "../../store/hooks";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { useBoardItemSocket } from "./board-socket/context";
import { useSocket } from "../../hooks/socket/context";
import { applyDragResult } from "../../utils/tools";


const Board = () => {
	const fetchBoardAction = useFetchBoardByIdAction();
	const addTaskAction = useAddTaskAction();
	const updateTaskAction = useUpdateTaskAction();
	const deleteTaskAction = useDeleteTaskction();
	const addColumnAction = useAddColumnAction();
	const updateColumnAction = useUpdateColumnAction();
	const removeColumnAction = useDeleteColumnAction();
	const updateBoardRemoteMode = useUpdateBoardRemote();
	const { boardId } = useParams<{ boardId: string }>();
	const navigate = useNavigate();
	const boardData = useCurrentBoard();
	const error = useBoardsError();
	const socket = useSocket()
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");

	useEffect(() => {
		if (boardId) {
			fetchBoardAction(boardId);
		}
	}, [boardId, fetchBoardAction]);

	useEffect(() => {
		if (error === "Error al cargar tablero") {
			navigate("/404");
		}
	}, [error, navigate]);

	useEffect(() => {
		if (!socket) return;

		// Se ejecuta cuando otro usuario termina de hacer drag
		const handleRemoteDragEnd = ({ result }:{result:DropResult}) => {
			//Actualiza redux para actualizar la UI
			updateBoardRemoteMode(result)
		};

		socket.on("board:dragend", handleRemoteDragEnd);

		return () => {
			socket.off("board:dragend", handleRemoteDragEnd);
		};
	}, []);

	const onDragEnd = useCallback(
		(result: DropResult) => {
			const { destination, source, type } = result;
			
			handleDragEnd(result);
			if (!destination) {
				handleDragEnd(result);
				return;
			}
			if (
				destination.droppableId === source.droppableId &&
				destination.index === source.index
			) {
				return;
			}
			updateBoardRemoteMode(result);
			
			// setBoardData(newBoardData); // Actualiza la UI local inmediatamente
			if (!boardData) return;
			const newBoardData = applyDragResult(boardData, result);

			// ARRASRTRE DE COLUMNAS
			if (type === "column") {
				newBoardData.lists.forEach((list, index) => {
					updateColumnAction(Number(list.id), { position: index });
				});				
			} else {
				// Drag Para tarjeta
				const destListId = destination.droppableId;
				const sourceListId = source.droppableId;

				const destCol = newBoardData.lists.find(
					(c) => c.id?.toString() === destListId,
				);

				// Actualiza las tarjetas en la columna de destino
				if (destCol) {
					destCol.cards.forEach((task, index) => {
						updateTaskAction(Number(destListId), task.id!.toString(), {
							listId: Number(destListId), // Asegura que el listId sea el correcto
							position: index,
						});
					});
				}

				// Si se movió entre columnas, actualiza también las de la columna de origen
				if (sourceListId !== destListId) {
					const sourceCol = newBoardData.lists.find(
						(c) => c.id?.toString() === sourceListId,
					);
					//Si se movió en la misma columna
					if (sourceCol) {
						sourceCol.cards.forEach((task, index) => {
							updateTaskAction(Number(sourceListId), task.id!.toString(), {
								position: index,
							});
						});
					}
				}				
			}
		},
		[boardData, updateColumnAction, updateTaskAction],
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

			addTaskAction(Number(columnId), newTask);
		},
		[boardData, addTaskAction],
	);

	const handleEditTask = useCallback(
		(
			columnId: string,
			taskId: string,
			updatedFields: { title?: string; description?: string },
		) => {
			updateTaskAction(Number(columnId), taskId, updatedFields);
		},
		[updateTaskAction],
	);

	const handleDeleteTask = useCallback(
		(taskId: string, columnId: string) => {
			if (!boardData) return;
			deleteTaskAction(columnId, taskId);
		},
		[boardData, deleteTaskAction],
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
			updateColumnAction(Number(columnId), { title: newTitle });
		},
		[boardData, updateColumnAction],
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
			addColumnAction(boardData.id!, newColumn);
			setNewColumnName("");
			setIsMenuOpen(false);
		}
	}, [boardData, newColumnName, addColumnAction]);

	const handleDeleteColumnClick = useCallback(
		(columnId: string | number) => {
			if (!boardData) return;
			removeColumnAction(columnId.toString());
		},
		[boardData, removeColumnAction],
	);

	const { handleDragStart, handleDragUpdate, handleDragEnd } =
		useBoardItemSocket();

	if (error) return <div>Error al cargar el tablero: {error}</div>;

	return (
		<BackofficePage>
			<DragDropContext
				onDragStart={handleDragStart}
				onDragUpdate={handleDragUpdate}
				onDragEnd={onDragEnd}
			>
				<Droppable droppableId="board" type="column" direction="horizontal">
					{(provided) => {
						return (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
								className="custom-scrollbar flex h-[calc(100vh-8rem)] gap-6 overflow-x-auto px-4 py-8 sm:px-8"
							>
								{boardData?.lists.map((column) => (
									<Column
										key={column.id}
										column={column}
										onAddTask={(task) => handleAddTask(Number(column.id), task)}
										onEditTask={(updatedFields) =>
											selectedColumnId && selectedTask
												? handleEditTask(
														selectedColumnId,
														selectedTask.id!.toString(),
														updatedFields,
													)
												: undefined
										}
										onDeleteTask={(taskId) =>
											handleDeleteTask(taskId, column.id!)
										}
										onEditColumnTitle={handleEditColumnTitle}
										onDeleteColumn={() => handleDeleteColumnClick(column.id!)}
										onOpenTaskDetail={(task) =>
											openTaskDetail(task, column.id!)
										}
										isNewColumnInEditMode={false}
									/>
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
						);
					}}
				</Droppable>
			</DragDropContext>

			{selectedTask && selectedColumnId && (
				<TaskDetailModal
					task={selectedTask}
					boardId={boardId}
					columnId={selectedColumnId}
					onClose={closeTaskDetail}
					onEditTask={(updatedFields) =>
						handleEditTask(
							selectedColumnId,
							selectedTask.id!.toString(),
							updatedFields,
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
