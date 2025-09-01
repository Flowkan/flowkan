import React, { useState, useEffect, useRef } from "react";
import type { Task } from "../pages/board/types";

interface TaskDetailModalProps {
	task: Task;
	columnId: string;
	onClose: () => void;
	onEditTask: (
		columnId: string,
		taskId: string,
		newContent: string,
		newDescription?: string,
	) => void;
	onDeleteTask: (columnId: string, taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	task,
	columnId,
	onClose,
	onEditTask,
	onDeleteTask,
}) => {
	const [editedContent, setEditedContent] = useState(task.description || "");
	const [editedDescription, setEditedDescription] = useState(
		task.description || "",
	);
	const modalRef = useRef<HTMLDivElement>(null);
	const contentInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (contentInputRef.current) {
			contentInputRef.current.focus();
		}
	}, []);

	const handleSave = React.useCallback(() => {
		if (
			editedContent.trim() !== (task.description || "").trim() ||
			editedDescription.trim() !== (task.description || "").trim()
		) {
			onEditTask(
				columnId,
				task.id,
				editedContent.trim(),
				editedDescription.trim(),
			);
		}
	}, [editedContent, editedDescription, columnId, task, onEditTask]);

	const handleDelete = () => {
		if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
			onDeleteTask(columnId, task.id);
			onClose();
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				handleSave();
				onClose();
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [handleSave, onClose]);

	const handleInputKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		if (e.key === "Enter" && e.currentTarget.tagName === "INPUT") {
			e.preventDefault();
			e.currentTarget.blur();
		} else if (e.key === "Escape") {
			if (e.currentTarget.id === "content-input") {
				setEditedContent(task.description || "");
			} else if (e.currentTarget.id === "description-textarea") {
				setEditedDescription(task.description || "");
			}
			e.currentTarget.blur();
			onClose();
		}
	};

	return (
		<div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			{" "}
			{/* Oscurecido más el fondo */}
			<div
				ref={modalRef}
				className="bg-background-card relative flex w-full max-w-3xl gap-6 rounded-lg p-6 shadow-2xl" // Aumentado padding y sombra, añadido flex y gap
			>
				<button
					onClick={() => {
						handleSave();
						onClose();
					}}
					className="text-text-placeholder hover:text-text-body absolute top-3 right-3 text-4xl leading-none" // Icono más grande, ajuste de posición
					title="Cerrar y guardar"
				>
					&times;
				</button>

				<div className="flex flex-grow flex-col">
					<div className="mb-4 flex items-center gap-2">
						<span className="text-text-placeholder text-2xl">📋</span>
						<input
							id="content-input"
							ref={contentInputRef}
							type="text"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							onBlur={handleSave}
							onKeyDown={handleInputKeyDown}
							className="border-border-medium focus:border-accent w-full resize-none border-b bg-transparent text-2xl font-bold outline-none" // resize-none para textarea simulado
						/>
					</div>

					<div className="mb-6">
						<h4 className="text-text-placeholder mb-2 text-sm font-semibold">
							Añadir a la tarjeta
						</h4>
						<div className="flex flex-wrap gap-2">
							<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<span className="text-lg">+</span> Añadir
							</button>
							<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<span className="text-lg">🏷️</span> Etiquetas
							</button>
							<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<span className="text-lg">🗓️</span> Fechas
							</button>
							<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<span className="text-lg">✔️</span> Checklist
							</button>
							<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<span className="text-lg">👥</span> Miembros
							</button>
						</div>
					</div>

					<div className="mb-6 flex flex-col">
						<h4 className="text-text-heading mb-2 flex items-center gap-2 font-semibold">
							<span className="text-text-placeholder text-lg">📝</span>{" "}
							Descripción
						</h4>
						<textarea
							id="description-textarea"
							value={editedDescription}
							onChange={(e) => setEditedDescription(e.target.value)}
							onBlur={handleSave}
							onKeyDown={handleInputKeyDown}
							placeholder="Añade una descripción más detallada..."
							className="border-border-medium focus:ring-accent bg-background-input text-text-body placeholder-text-placeholder min-h-[120px] w-full resize-y rounded-md border p-3 focus:ring-1 focus:outline-none"
						/>
					</div>

					<div>
						<h4 className="text-text-heading mb-2 flex items-center gap-2 font-semibold">
							<span className="text-text-placeholder text-lg">💬</span>{" "}
							Comentarios y Actividad
						</h4>
						<textarea
							placeholder="Escribe un comentario..."
							className="border-border-medium focus:ring-accent bg-background-input text-text-body placeholder-text-placeholder min-h-[60px] w-full resize-y rounded-md border p-3 focus:ring-1 focus:outline-none"
						></textarea>
						<div className="bg-background-light-grey mt-4 rounded-md p-3">
							<p className="text-text-body text-sm">
								<span className="font-semibold">vocarcm</span> ha añadido esta
								tarjeta a Backlog
							</p>
							<p className="text-text-placeholder mt-1 text-xs">
								21 nov 2022, 19:44
							</p>
						</div>
					</div>
				</div>

				<div className="w-64 flex-shrink-0 pt-10">
					<h4 className="text-text-placeholder mb-3 text-sm font-semibold">
						Opciones
					</h4>
					<div className="space-y-2">
						<button
							onClick={() => alert("Mover (no implementado)")}
							className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200"
						>
							<span className="text-lg">➡️</span> Mover
						</button>
						<button
							onClick={() => alert("Copiar (no implementado)")}
							className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200"
						>
							<span className="text-lg">📄</span> Copiar
						</button>
						<button
							onClick={() => alert("Archivar (no implementado)")}
							className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200"
						>
							<span className="text-lg">🗄️</span> Archivar
						</button>
						<button
							onClick={handleDelete}
							className="bg-background-light-grey text-text-body hover:bg-danger-dark hover:text-background-card flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200 hover:bg-red-400"
						>
							<span className="text-lg">🗑️</span> Eliminar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskDetailModal;
