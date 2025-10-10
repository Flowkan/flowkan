import React, { useState, useRef, useEffect, useCallback } from "react";
import { Droppable } from "@hello-pangea/dnd";
import type { Column as ColumnType, Task } from "../pages/boards/types";
import DropdownMenu from "./DropdownMenu";
import WrapColumn from "./WrapColumn";
import { useTranslation } from "react-i18next";

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

	const { t } = useTranslation();

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
			onEditColumnTitle(column.id, editedTitle.trim());
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
					onEditColumnTitle(column.id, editedTitle.trim());
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
			window.confirm(t("column.deleteConfirm", { title: column.title })) &&
			column.id
		) {
			onDeleteColumn(column.id);
		}
	}, [column.id, column.title, onDeleteColumn, t]);

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

	const columnRef = useRef<HTMLDivElement | null>(null);
	const widthGhost = useRef(0);
	if (columnRef.current) {
		widthGhost.current = columnRef.current.clientWidth;
	}

	return (
		<div className="flex w-80 max-w-md flex-shrink-0 flex-grow flex-col rounded-lg bg-white/45 p-4 shadow-xl">
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
						column.title || t("column.edit")
					)}
					<span className="bg-dark-footer ml-1 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
						{column.cards?.length ?? 0}
					</span>
				</h3>

				<DropdownMenu
					buttonContent={
						<span className="-mt-1 text-3xl leading-none">&#x22EE;</span>
					}
					title={t("column.dropdownMenu.title")}
					closeButton
				>
					<button
						onClick={() => {
							handleAddTask();
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.addCard")}
					</button>
					<button
						onClick={() => alert(t("column.copy.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.copy.msg")}
					</button>
					<button
						onClick={() => alert(t("column.move.list.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.move.list.msg")}
					</button>
					<button
						onClick={() => alert(t("column.move.cards.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.move.cards.msg")}
					</button>
					<button
						onClick={() => alert(t("column.sort.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.sort.msg")}
					</button>
					<button
						onClick={() => alert(t("column.follow.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.follow.msg")}
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={() => alert(t("column.changeColor.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.changeColor.msg")}
					</button>
					<button
						onClick={() => alert(t("column.auto.alert"))}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.auto.msg")}
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={() => {
							if (
								window.confirm(
									t("column.archive.list.confirm", { title: column.title }),
								)
							) {
								alert(t("column.archive.list.alert"));
							}
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.archive.list.msg")}
					</button>
					<button
						onClick={() => {
							if (
								window.confirm(
									t("column.archive.cards.confirm", { title: column.title }),
								)
							) {
								alert(t("column.archive.cards.alert"));
							}
						}}
						className="text-background-card block w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-700"
						role="menuitem"
					>
						{t("column.archive.cards.msg")}
					</button>

					<div className="border-border-light my-2 border-t"></div>

					<button
						onClick={handleDeleteColumnClick}
						className="text-danger-dark hover:bg-danger-light block w-full px-4 py-2 text-left text-sm hover:bg-red-500"
						role="menuitem"
					>
						{t("column.delete")}
					</button>
				</DropdownMenu>
			</div>

			<Droppable droppableId={String(column.id)} type="task">
				{(provided, snapshot) => (
					<WrapColumn
						provided={provided}
						snapshot={snapshot}
						columnId={String(column.id)}
						cards={column.cards}
						onDeleteTask={onDeleteTask}
						onEditTask={onEditTask}
						onOpenTaskDetail={onOpenTaskDetail}
					/>
				)}
			</Droppable>

			<div className="mt-2">
				{!isAddingTask ? (
					<button
						ref={addTaskButtonRef}
						onClick={handleStartAddingTask}
						className="bg-background-input hover:bg-background-hover-card flex w-full items-center justify-center rounded-md py-2 font-semibold text-black/95 transition-colors duration-200"
					>
						{t("column.add.btn")}
					</button>
				) : (
					<>
						<input
							ref={addTaskInputRef}
							type="text"
							placeholder={t("column.add.action.placeholder")}
							value={newTaskContent}
							onChange={(e) => setNewTaskContent(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
							className="border-border-medium focus:ring-primary focus:border-primary bg-background-input text-text-body placeholder-text-placeholder w-full rounded-md border p-3 focus:ring-2 focus:outline-none"
						/>
						<div className="mt-2 flex gap-2">
							<button
								onClick={handleAddTask}
								className="bg-primary text-text-on-accent hover:bg-accent-dark hover:bg-primary-hover flex-grow rounded-md py-2 font-semibold transition-colors duration-200"
							>
								{t("column.add.action.btn")}
							</button>
							<button
								onClick={handleCancelAddTask}
								className="text-text-placeholder hover:text-danger-dark px-2 text-3xl leading-none transition-colors duration-200"
								title={t("column.add.action.cancel")}
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
