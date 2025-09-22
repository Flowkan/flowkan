import React, { useState, useRef, useEffect, useCallback } from "react";
import { Droppable } from "@hello-pangea/dnd";
import type { Column as ColumnType, Task } from "../pages/boards/types";
import TaskCard from "./TaskCard";
import DropdownMenu from "./DropdownMenu";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";
// import { useBoardItemSocket } from "../pages/boards/board-socket/context";

interface Props {
	column: ColumnType;
	onAddTask: (content: string) => void;
	onEditTask: (updatedFields: { title?: string; description?: string }) => void;
	onDeleteTask: (taskId: string, columnId: string) => void;
	onEditColumnTitle: (columnId: string, newTitle: string) => void;
	onDeleteColumn: (columnId: string) => void;
	onOpenTaskDetail: (task: Task, columnId: string) => void;
	isNewColumnInEditMode: boolean;
}

const Column = ({
	column,
	onAddTask,
	onEditTask,
	onDeleteTask,
	onEditColumnTitle,
	onDeleteColumn,
	onOpenTaskDetail,
	isNewColumnInEditMode,
}: Props) => {
	const [newTaskContent, setNewTaskContent] = useState("");
	const [isEditingTitle, setIsEditingTitle] = useState(isNewColumnInEditMode);
	const [editedTitle, setEditedTitle] = useState(column.title);
	const [isAddingTask, setIsAddingTask] = useState(false);
	const addTaskInputRef = useRef<HTMLInputElement>(null);
	const addTaskButtonRef = useRef<HTMLButtonElement>(null);
	const titleInputRef = useRef<HTMLInputElement>(null);

	const handleAddTask = useCallback(() => {
		if (newTaskContent.trim()) {
			onAddTask(newTaskContent.trim());
			setNewTaskContent("");
			setIsAddingTask(false);
		}
	}, [newTaskContent, onAddTask]);

	const handleTitleClick = useCallback(() => {
		setIsEditingTitle(true);
	}, []);

	const handleTitleBlur = useCallback(() => {
		setIsEditingTitle(false);
		if (editedTitle.trim() === "") {
			if (isNewColumnInEditMode && column.id) {
				onDeleteColumn(column.id);
			} else {
				setEditedTitle(column.title);
			}
		} else if (editedTitle.trim() !== column.title && column.id) {
			onEditColumnTitle(column.id!, editedTitle.trim());
		}
	}, [
		editedTitle,
		column.title,
		onEditColumnTitle,
		isNewColumnInEditMode,
		onDeleteColumn,
		column.id,
	]);

	const handleTitleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				setIsEditingTitle(false);
				if (editedTitle.trim() === "") {
					e.currentTarget.blur();
				} else if (column.id) {
					onEditColumnTitle(column.id!, editedTitle.trim());
				}
			} else if (e.key === "Escape") {
				setIsEditingTitle(false);
				if (isNewColumnInEditMode && column.id) {
					onDeleteColumn(column.id);
				} else {
					setEditedTitle(column.title);
				}
			}
		},
		[
			editedTitle,
			column.title,
			onEditColumnTitle,
			isNewColumnInEditMode,
			onDeleteColumn,
			column.id,
		],
	);

	const handleDeleteColumnClick = useCallback(() => {
		if (
			window.confirm(
				`¿Estás seguro de que quieres eliminar la columna "${column.title}"? Todas las tareas dentro se perderán.`,
			) &&
			column.id
		) {
			onDeleteColumn(column.id);
		}
	}, [column.id, column.title, onDeleteColumn]);

	const handleStartAddingTask = useCallback(() => {
		setIsAddingTask(true);
	}, []);

	const handleCancelAddTask = useCallback(() => {
		setIsAddingTask(false);
		setNewTaskContent("");
	}, []);

	useEffect(() => {
		if (isAddingTask && addTaskInputRef.current) {
			addTaskInputRef.current.focus();
		}
	}, [isAddingTask]);

	useEffect(() => {
		if (isNewColumnInEditMode && titleInputRef.current) {
			titleInputRef.current.focus();
			titleInputRef.current.select();
		}
	}, [isNewColumnInEditMode]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const clickedInsideInput =
				addTaskInputRef.current &&
				addTaskInputRef.current.contains(event.target as Node);
			const clickedInsideButton =
				addTaskButtonRef.current &&
				addTaskButtonRef.current.contains(event.target as Node);

			if (isAddingTask && !clickedInsideInput && !clickedInsideButton) {
				if (newTaskContent.trim()) {
					handleAddTask();
				} else {
					handleCancelAddTask();
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isAddingTask, newTaskContent, handleAddTask, handleCancelAddTask]);

	const { remoteDrag } = useBoardItemSocket();
	return (
		<div className="bg-background-column flex h-full max-h-[calc(100vh-160px)] w-80 flex-shrink-0 flex-col rounded-lg p-4 shadow-xl">
			<div className="mb-4 flex items-center justify-between">
				<h3
					onClick={handleTitleClick}
					className="mr-2 flex-grow cursor-pointer px-2 py-1 text-xl font-bold select-none"
				>
					{isEditingTitle ? (
						<input
							ref={titleInputRef}
							type="text"
							value={editedTitle}
							onChange={(e) => setEditedTitle(e.target.value)}
							onBlur={handleTitleBlur}
							onKeyDown={handleTitleKeyDown}
							className="text-text-heading w-full border border-blue-500 bg-transparent px-2 py-1 text-xl font-bold outline-none"
						/>
					) : (
						column.title || "Haz clic para editar"
					)}
					<span className="bg-dark-footer ml-1 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
						{column.cards?.length ?? 0}
					</span>
				</h3>

				<DropdownMenu
					buttonContent={
						<span className="-mt-1 text-3xl leading-none">&#x22EE;</span>
					}
					title="Enumerar acciones"
					closeButton
				>
					<button
						onClick={() => {
							handleAddTask();
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Añadir tarjeta
					</button>
					<button
						onClick={() => alert("Copiar lista (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Copiar lista
					</button>
					<button
						onClick={() => alert("Mover lista (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Mover lista
					</button>
					<button
						onClick={() => alert("Mover todas las tarjetas (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Mover todas las tarjetas de esta lista
					</button>
					<button
						onClick={() => alert("Ordenar por... (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Ordenar por...
					</button>
					<button
						onClick={() => alert("Seguir (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Seguir
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={() => alert("Cambiar color de lista (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Cambiar color de lista
					</button>
					<button
						onClick={() => alert("Automatización (no implementado)")}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Automatización
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={() => {
							if (
								window.confirm(
									`¿Estás seguro de que quieres archivar esta lista "${column.title}"?`,
								)
							) {
								alert("Archivar esta lista (no implementado)");
							}
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Archivar esta lista
					</button>
					<button
						onClick={() => {
							if (
								window.confirm(
									`¿Estás seguro de que quieres archivar todas las tarjetas de "${column.title}"?`,
								)
							) {
								alert("Archivar todas las tarjetas (no implementado)");
							}
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						Archivar todas las tarjetas de esta lista
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={handleDeleteColumnClick}
						className="text-danger-dark hover:bg-danger-light block w-full px-4 py-2 text-left text-sm hover:bg-red-500"
						role="menuitem"
					>
						Eliminar Columna
					</button>
				</DropdownMenu>
			</div>

			<Droppable droppableId={String(column.id)} type="task">
				{(provided, snapshot) => {
					const remotePlaceholderIndex =
						remoteDrag?.destination?.droppableId === String(column.id)
							? remoteDrag.destination.index
							: null;
					return (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
							className={`min-h-[50px] flex-grow rounded-md p-2 transition-colors duration-200 ${
								snapshot.isDraggingOver ? "bg-background-hover-column" : ""
							} custom-scrollbar overflow-y-auto`}
						>
							{(column.cards ?? []).map((item: Task, index: number) => {
								const showPlaceholder = remotePlaceholderIndex === index;
								return (
									<>
										{showPlaceholder && (
											<div className="mt-2 h-12 w-full rounded-md border-2 border-dashed border-primary-hover" />
										)}
										<TaskCard
											key={item.id}
											task={item}
											index={index}
											columnId={String(column.id)}
											onEditTask={(updatedFields) => onEditTask(updatedFields)}
											onDeleteTask={onDeleteTask}
											onOpenTaskDetail={onOpenTaskDetail}
										/>
									</>
								);
							})}
							{/* Placeholder al final si corresponde */}
							{remotePlaceholderIndex !== null &&
								remotePlaceholderIndex === (column.cards?.length ?? 0) && (
									<div className="mt-2 h-12 w-full rounded-md border-2 border-dashed border-primary-hover" />
								)}
							{provided.placeholder}
						</div>
					);
				}}
			</Droppable>

			<div className="mt-4 flex flex-col gap-2">
				{!isAddingTask ? (
					<button
						ref={addTaskButtonRef}
						onClick={handleStartAddingTask}
						className="bg-background-input text-text-placeholder hover:bg-background-hover-card flex items-center justify-center rounded-md py-2 font-semibold transition-colors duration-200"
					>
						+ Añadir tarjeta
					</button>
				) : (
					<>
						<input
							ref={addTaskInputRef}
							type="text"
							placeholder="Título de la tarjeta..."
							value={newTaskContent}
							onChange={(e) => setNewTaskContent(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
							className="border-border-medium focus:ring-primary focus:border-primary bg-background-input text-text-body placeholder-text-placeholder w-full rounded-md border p-3 focus:ring-2 focus:outline-none"
						/>
						<div className="flex gap-2">
							<button
								onClick={handleAddTask}
								className="bg-primary text-text-on-accent hover:bg-accent-dark hover:bg-primary-hover flex-grow rounded-md py-2 font-semibold transition-colors duration-200"
							>
								Añadir tarjeta
							</button>
							<button
								onClick={handleCancelAddTask}
								className="text-text-placeholder hover:text-danger-dark px-2 text-3xl leading-none transition-colors duration-200"
								title="Cancelar"
							>
								&times;
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Column;
