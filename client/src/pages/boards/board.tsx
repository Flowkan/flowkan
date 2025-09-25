import { useState, useCallback, useEffect, useMemo } from "react";
import {
	DragDropContext,
	Droppable,
	type DropResult,	
} from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import type { Column as ColumnType, Board } from "./types";
import {	
	useBoards,
	useFetchBoardsAction,
	useBoardsLoading,
	useFetchBoardByIdAction,
	useAddTaskAction,
	useUpdateTaskAction,
	useBoardsError,
	useAddColumnAction,
	useDeleteColumnAction,
	useDeleteTaskction,
	useUpdateColumnAction,
	useUpdateBoardRemote,
} from "../../store/boards/hooks";
import { useBoardItemSocket } from "./board-socket/context";
import { useSocket } from "../../hooks/socket/context";
import { applyDragResult } from "../../utils/tools";	
import { BackofficePage } from "../../components/layout/backoffice_page";
import { useAppDispatch, useAppSelector } from "../../store";
import { editTask } from "../../store/boards/actions";
// import { Button } from "../../components/ui/Button";
// import { FormFields } from "../../components/ui/FormFields";
// import { Icon } from "@iconify/react";
// import { t } from "i18next";


const Board = () => {
	const fetchBoardAction = useFetchBoardByIdAction();
	const fetchBoardsAction = useFetchBoardsAction();
	const addTaskAction = useAddTaskAction();
	const updateTaskAction = useUpdateTaskAction();
	const deleteTaskAction = useDeleteTaskction();
	const addColumnAction = useAddColumnAction();
	const updateColumnAction = useUpdateColumnAction();
	const removeColumnAction = useDeleteColumnAction();
	const updateBoardRemoteMode = useUpdateBoardRemote();
	// const { boardId } = useParams<{ boardId: string }>();
	const { slug } = useParams<{ slug: string }>();
	const allBoards = useBoards();
	const boardsLoading = useBoardsLoading();
	const navigate = useNavigate();
	const error = useBoardsError();
	const socket = useSocket()	
	const dispatch = useAppDispatch();

	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [newColumnName, setNewColumnName] = useState("");
	const [resolvedBoardId, setResolvedBoardId] = useState<string | undefined>(
		undefined,
	);
	const boardData = useAppSelector((state) => state.boards.currentBoard);

	const selectedTask = useMemo(() => {
		if (!boardData || !selectedTaskId) return null;
		return boardData.lists
			.flatMap((col) => col.cards)
			.find((t) => t.id?.toString() === selectedTaskId);
	}, [boardData, selectedTaskId]);

	useEffect(() => {
		if (!slug) return;

		if (allBoards.length > 0) {
			const foundBoard = allBoards.find((b) => b.slug === slug);

			if (foundBoard) {
				const newId = foundBoard.id.toString();
				if (newId !== resolvedBoardId) {
					setResolvedBoardId(newId);
					fetchBoardAction(newId);
				}
			} else if (!foundBoard) {
				console.error("Board no encontrado para el slug:", slug);
			}
		} else if (!boardsLoading) {
			fetchBoardsAction(0, 100);
		}
	}, [
		slug,
		allBoards,
		fetchBoardsAction,
		fetchBoardAction,
		navigate,
		boardsLoading,
		resolvedBoardId,
	]);

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
			
			// Actualiza la UI local inmediatamente
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
			updatedFields: { title?: string; description?: string } | FormData,
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

	const openTaskDetail = useCallback((taskId: string, columnId: string) => {
		setSelectedTaskId(taskId);
		setSelectedColumnId(columnId);
	}, []);

	const closeTaskDetail = useCallback(() => {
		setSelectedTaskId(null);
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
			addColumnAction(boardData.id, newColumn);
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
											task.id !== undefined
											? openTaskDetail(task.id.toString(), column.id!)
											: undefined
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
					boardId={resolvedBoardId}
					columnId={selectedColumnId}
					onClose={closeTaskDetail}
					onEditTask={(data) =>
						dispatch(
							editTask(
								Number(selectedColumnId),
								selectedTask.id!.toString(),
								data,
							),
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
