import { useState, useCallback, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import Column from "../../components/Column";
import TaskDetailModal from "../../components/TaskDetailModal";
import type { Column as ColumnType } from "./types";
import {
	useFetchBoardByIdAction,
	useAddTaskAction,
	useUpdateTaskAction,
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
import { Button } from "../../components/ui/Button";
import { FormFields } from "../../components/ui/FormFields";
import { Icon } from "@iconify/react";
import { t } from "i18next";
import { useDismiss } from "../../hooks/useDismissClickAndEsc";

const Board = () => {
	const fetchBoardAction = useFetchBoardByIdAction();
	const addTaskAction = useAddTaskAction();
	const updateTaskAction = useUpdateTaskAction();
	const deleteTaskAction = useDeleteTaskction();
	const addColumnAction = useAddColumnAction();
	const updateColumnAction = useUpdateColumnAction();
	const removeColumnAction = useDeleteColumnAction();
	const updateBoardRemoteMode = useUpdateBoardRemote();
	const { slug } = useParams<{ slug: string }>();
	const socket = useSocket();
	const dispatch = useAppDispatch();

	const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
	const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
	const {
		open: openMenu,
		setOpen: setOpenMenu,
		ref: refMenu,
	} = useDismiss<HTMLDivElement>();
	const [newColumnName, setNewColumnName] = useState("");
	const boardData = useAppSelector((state) => state.boards.currentBoard);

	const { handleDragStart, handleDragUpdate, handleDragEnd } =
		useBoardItemSocket();

	const selectedTask = useMemo(() => {
		if (!boardData || !selectedTaskId) return null;
		return boardData.lists
			.flatMap((col) => col.cards)
			.find((t) => t.id?.toString() === selectedTaskId);
	}, [boardData, selectedTaskId]);

	useEffect(() => {
		if (!slug) return;
		fetchBoardAction(slug);
	}, [slug, fetchBoardAction]);

	useEffect(() => {
		if (!socket) return;

		const handleRemoteDragEnd = ({ result }: { result: DropResult }) => {
			updateBoardRemoteMode(result);
		};

		socket.on("board:dragend", handleRemoteDragEnd);

		return () => {
			socket.off("board:dragend", handleRemoteDragEnd);
		};
	}, [socket, updateBoardRemoteMode]);

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

			if (!boardData) return;
			const newBoardData = applyDragResult(boardData, result);

			if (type === "column") {
				newBoardData.lists.forEach((list, index) => {
					updateColumnAction(Number(list.id), { position: index });
				});
			} else {
				const destListId = destination.droppableId;
				const sourceListId = source.droppableId;
				const destCol = newBoardData.lists.find(
					(c) => c.id?.toString() === destListId,
				);

				if (destCol) {
					destCol.cards.forEach((task, index) => {
						updateTaskAction(Number(destListId), task.id!.toString(), {
							listId: Number(destListId),
							position: index,
						});
					});
				}

				if (sourceListId !== destListId) {
					const sourceCol = newBoardData.lists.find(
						(c) => c.id?.toString() === sourceListId,
					);
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
		[
			boardData,
			handleDragEnd,
			updateBoardRemoteMode,
			updateColumnAction,
			updateTaskAction,
		],
	);

	const handleAddTask = useCallback(
		(columnId: number, title: string, description: string = "") => {
			if (!boardData) return;
			const currentColumn = boardData.lists.find(
				(c) => c.id?.toString() === columnId.toString(),
			);
			if (!currentColumn) return;
			const newTask = {
				title: title,
				description: description,
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

	const handleAddColumnToggle = () => setOpenMenu((prev) => !prev);

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
			setOpenMenu(false);
		}
	}, [newColumnName, boardData, addColumnAction, setOpenMenu]);

	const handleDeleteColumnClick = useCallback(
		(columnId: string | number) => {
			if (!boardData) return;
			removeColumnAction(columnId.toString());
		},
		[boardData, removeColumnAction],
	);

	return (
		<BackofficePage
			title={boardData?.title}
			backgroundImg={boardData?.image}
			boardId={boardData?.id}
			onAddTask={handleAddTask}
			columns={
				boardData?.lists?.map((c) => ({ id: c.id!, title: c.title })) ?? []
			}
		>
			<DragDropContext
				onDragStart={handleDragStart}
				onDragUpdate={handleDragUpdate}
				onDragEnd={onDragEnd}
			>
				<Droppable droppableId="board" type="column" direction="horizontal">
					{(provided) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className="custom-scrollbar flex min-h-[calc(100vh-8rem)] items-stretch gap-6 overflow-x-auto px-4 py-8 sm:px-8"
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
							<div
								className="relative flex w-full flex-row items-baseline justify-start sm:w-80"
								ref={refMenu}
							>
								<Button
									onClick={handleAddColumnToggle}
									className="text-text-placeholder hover:bg-background-hover-column border-border-medium bg-gray/20 hover:border-accent bg-border-light bg-gray/80 flex h-10 w-10 items-center justify-center rounded-lg border-2 text-2xl font-semibold shadow-md transition-colors duration-200"
								>
									<div className="shadow-md transition-all duration-200 ease-in-out hover:scale-[1.45] hover:rotate-90 hover:shadow-xl hover:shadow-indigo-300/30 active:scale-123">
										<Icon icon="oui:plus" width="1.2em" height="1.2em" />
									</div>
								</Button>
								{openMenu && (
									<div
										className="bg-background-dark-footer fixed top-24 right-4 z-50 w-72 rounded-lg border border-gray-200 p-4 shadow-lg"
										ref={refMenu}
									>
										<h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
											{t("board.add_column", "Añadir Columna")}
										</h3>
										<div className="mb-4">
											<FormFields
												type="text"
												placeholder={t("board.columnName")}
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
												{t("board.createColumn")}
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
					isOpen={!!selectedTask}
					task={selectedTask}
					boardId={boardData?.id}
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
