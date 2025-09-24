import { useState, useCallback, useEffect, useMemo } from "react";
import {
	DragDropContext,
	Droppable,
	type DropResult,
	type DraggableLocation,
} from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import Column from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import type { Column as ColumnType } from "./types";
import {
	useFetchBoardByIdAction,
	useAddTaskAction,
	useUpdateTaskAction,
	useBoardsError,
	useAddColumnAction,
	useDeleteColumnAction,
	useDeleteTaskction,
	useUpdateColumnAction,
	useBoards,
	useFetchBoardsAction,
	useBoardsLoading,
} from "../../store/boards/hooks";
import { BackofficePage } from "../../components/layout/backoffice_page";
import { useAppDispatch, useAppSelector } from "../../store";
import { editTask } from "../../store/boards/actions";
import { Button } from "../../components/ui/Button";
import { FormFields } from "../../components/ui/FormFields";
import { Icon } from "@iconify/react";

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
	const fetchBoardAction = useFetchBoardByIdAction();
	const fetchBoardsAction = useFetchBoardsAction();
	const addTaskAction = useAddTaskAction();
	const updateTaskAction = useUpdateTaskAction();
	const deleteTaskAction = useDeleteTaskction();
	const addColumnAction = useAddColumnAction();
	const updateColumnAction = useUpdateColumnAction();
	const removeColumnAction = useDeleteColumnAction();
	const { slug } = useParams<{ slug: string }>();
	const allBoards = useBoards();
	const boardsLoading = useBoardsLoading();
	const navigate = useNavigate();
	const error = useBoardsError();
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

	const onDragEnd = useCallback(
		(result: DropResult) => {
			if (!boardData) return;
			const { type, source, destination } = result;
			if (!destination) return;

			// ARRASRTRE DE COLUMNAS
			if (type === "column") {
				const newLists = reorder(
					boardData.lists,
					source.index,
					destination.index,
				);

				newLists.forEach((col, index) => {
					updateColumnAction(Number(col.id), { position: index });
				});
			} else {
				// ARRASRTRE DE TARJETAS
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
					newSourceCards = reorder(
						sourceCol.cards,
						source.index,
						destination.index,
					);
					newDestCards = newSourceCards;
				} else {
					const result = move(
						sourceCol.cards,
						destCol.cards,
						source,
						destination,
					);
					newSourceCards = result[sInd];
					newDestCards = result[dInd];
				}

				// Persistencia en API: actualizar posición de cada tarjeta
				newDestCards.forEach((t, index) => {
					updateTaskAction(Number(dInd), t.id!.toString(), {
						listId: Number(dInd),
						position: index,
					});
				});

				if (sInd !== dInd) {
					newSourceCards.forEach((t, index) => {
						updateTaskAction(Number(sInd), t.id!.toString(), {
							listId: Number(sInd),
							position: index,
						});
					});
				}
			}
		},
		[boardData, updateTaskAction, updateColumnAction],
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

	if (error) return <div>Error al cargar el tablero: {error}</div>;

	return (
		<BackofficePage title={boardData?.title} backgroundImg={boardData?.image}>
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="board" type="column" direction="horizontal">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="custom-scrollbar flex gap-4 px-4 py-8 sm:px-8"
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
								<Button
									onClick={handleAddColumnToggle}
									className="text-text-placeholder hover:bg-background-hover-column border-border-medium bg-gray/20 hover:border-accent bg-border-light bg-gray/80 flex h-10 w-10 items-center justify-center rounded-lg border-2 text-2xl font-semibold shadow-md transition-colors duration-200"
								>
									{/* Icon Plus */}
									<div className="shadow-md transition-all duration-200 ease-in-out hover:scale-[1.45] hover:rotate-90 hover:shadow-xl hover:shadow-indigo-300/30 active:scale-123">
										<Icon icon="oui:plus" width="1.2em" height="1.2em" />
									</div>
								</Button>
								{isMenuOpen && (
									<div className="bg-background-dark-footer absolute top-16 z-50 mt-2 w-full rounded-lg border border-gray-200 p-4 shadow-lg">
										<h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
											Gestionar Columnas
										</h3>
										<div className="mb-4">
											<FormFields
												type="text"
												placeholder="Nombre de la nueva columna"
												value={newColumnName}
												onChange={(e) => setNewColumnName(e.target.value)}
												className="w-full rounded border bg-gray-100 p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
												id={"newColumn"}
												name={"newColumn"}
											/>
											<Button
												onClick={handleCreateColumn}
												className="mt-2 w-full rounded bg-blue-500 p-2 text-white transition-colors duration-200 hover:bg-blue-600"
											>
												Crear Columna
											</Button>
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
