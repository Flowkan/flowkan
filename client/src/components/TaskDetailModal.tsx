import React, { useState, useEffect, useRef } from "react";
import type { Task } from "../pages/boards/types";
import type { User } from "../pages/login/types";
import { getBoardUsers } from "../pages/boards/service";
import { Avatar } from "./ui/Avatar";
import { useAddAssigneeAction, useRemoveAssigneeAction } from "../store/hooks";
import { Editor } from "@tinymce/tinymce-react";

interface TaskDetailModalProps {
	task: Task;
	columnId: string;
	boardId?: string;
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
	boardId,
	onClose,
	onEditTask,
	onDeleteTask,
}) => {
	const addAssignee = useAddAssigneeAction();
	const removeAssignee = useRemoveAssigneeAction();
	const [editedContent, setEditedContent] = useState(task.title || "");
	const [editedDescription, setEditedDescription] = useState(
		task.description || "",
	);
	const [showUsers, setShowUsers] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [usersError, setUsersError] = useState<Error | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [assignedUsers, setAssignedUsers] = useState<User[]>(
		task.assignees?.map((a) => a.user) || [],
	);

	const modalRef = useRef<HTMLDivElement>(null);
	const contentInputRef = useRef<HTMLInputElement>(null);
	const usersRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef(null);

	useEffect(() => {
		if (contentInputRef.current) contentInputRef.current.focus();
	}, []);

	const handleSave = React.useCallback(() => {
		if (
			editedContent.trim() !== (task.title || "").trim() ||
			editedDescription.trim() !== (task.description || "").trim()
		) {
			onEditTask(
				columnId,
				task.id!.toString(),
				editedContent.trim(),
				editedDescription.trim(),
			);
		}
	}, [editedContent, editedDescription, columnId, task, onEditTask]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				modalRef.current &&
				!modalRef.current.contains(target) &&
				!(target as HTMLElement).closest(".tox")
			) {
				handleSave();
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose, editedContent, editedDescription, handleSave]);

	useEffect(() => {
		if (!showUsers) return;
		const handleClickOutsideUsers = (event: MouseEvent) => {
			if (
				usersRef.current &&
				!usersRef.current.contains(event.target as Node)
			) {
				setShowUsers(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutsideUsers);
		return () =>
			document.removeEventListener("mousedown", handleClickOutsideUsers);
	}, [showUsers]);

	const handleDelete = () => {
		if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
			onDeleteTask(columnId, task.id!.toString());
			onClose();
		}
	};

	const handleToggleUsers = async () => {
		if (!showUsers && boardId) {
			setLoadingUsers(true);
			setUsersError(null);
			try {
				const fetchedUsers = await getBoardUsers(boardId);
				setUsers(fetchedUsers);
				setFilteredUsers(fetchedUsers);
			} catch (error) {
				if (error instanceof Error) setUsersError(error);
			} finally {
				setLoadingUsers(false);
			}
		}
		setShowUsers(!showUsers);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setSearchTerm(term);
		setFilteredUsers(
			users.filter((u) => u.name.toLowerCase().includes(term.toLowerCase())),
		);
	};

	const handleToggleAssignedUser = (user: User) => {
		const isAlreadyAssigned = assignedUsers.find((u) => u.id === user.id);

		setAssignedUsers((prev) =>
			isAlreadyAssigned
				? prev.filter((u) => u.id !== user.id)
				: [...prev, user],
		);

		if (task.id) {
			if (isAlreadyAssigned) {
				removeAssignee(task.id, user.id);
			} else {
				addAssignee(task.id, user.id);
			}
		}
	};

	return (
		<div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
			<div
				ref={modalRef}
				className="bg-background-card relative flex max-h-5/6 w-full max-w-5xl gap-6 rounded-lg p-6 shadow-2xl"
			>
				<button
					onClick={() => {
						handleSave();
						onClose();
					}}
					className="text-text-placeholder hover:text-text-body absolute top-3 right-3 text-4xl leading-none"
					title="Cerrar y guardar"
				>
					&times;
				</button>

				<div className="relative flex flex-grow flex-col">
					<div className="mb-4 flex items-center gap-2">
						<span className="text-text-placeholder text-2xl">📋</span>
						<input
							ref={contentInputRef}
							type="text"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							onBlur={handleSave}
							className="border-border-medium focus:border-accent w-full border-b bg-transparent text-2xl font-bold outline-none"
						/>
					</div>

					<div className="relative mb-6">
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
							<button
								onClick={handleToggleUsers}
								className="bg-background-light-grey text-text-body hover:bg-background-hover-column relative flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
							>
								<span className="text-lg">👥</span> Miembros
							</button>
						</div>

						{showUsers && (
							<div
								ref={usersRef}
								className="border-border-medium bg-background-light-grey absolute top-full right-0 z-50 mt-2 max-h-60 w-64 overflow-y-auto rounded-md border p-2 shadow-lg"
							>
								<input
									type="text"
									placeholder="Buscar miembros..."
									value={searchTerm}
									onChange={handleSearchChange}
									className="mb-2 w-full rounded-md border p-1 text-sm outline-none"
								/>
								{loadingUsers && (
									<p className="text-center text-sm">Cargando usuarios...</p>
								)}
								{usersError && (
									<p className="text-sm text-red-500">{usersError.message}</p>
								)}
								{filteredUsers.map((user) => {
									const isAssigned = assignedUsers.find(
										(u) => u.id === user.id,
									);
									return (
										<div
											key={user.id}
											onClick={() => handleToggleAssignedUser(user)}
											className={`hover:bg-background-hover-column flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 ${
												isAssigned ? "bg-accent-light" : ""
											}`}
										>
											<Avatar name={user.name} photo={user.photo} />
											<span className="text-sm">{user.name}</span>
											{isAssigned && <span className="ml-auto text-xs">✓</span>}
										</div>
									);
								})}
							</div>
						)}
					</div>

					{assignedUsers.length > 0 && (
						<div className="mb-6">
							<h4 className="text-text-heading mb-2 text-sm font-semibold">
								Miembros
							</h4>
							<div className="flex flex-wrap gap-2">
								{assignedUsers.map((user) => (
									<div
										key={user.id}
										className="bg-background-light-grey flex items-center gap-1 rounded-full px-2 py-1 text-sm"
									>
										<Avatar name={user.name} photo={user.photo} size={28} />
										<span>{user.name}</span>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="mb-6 flex flex-col">
						<h4 className="text-text-heading mb-2 flex items-center gap-2 font-semibold">
							<span className="text-text-placeholder text-lg">📝</span>{" "}
							Descripción
						</h4>
						<Editor
							apiKey={import.meta.env.VITE_TINY_MCE}
							onInit={(_evt, editor) => (editorRef.current = editor)}
							value={editedDescription}
							init={{
								height: 200,
								menubar: false,
								plugins: [
									"advlist",
									"autolink",
									"lists",
									"link",
									"image",
									"charmap",
									"preview",
									"anchor",
									"searchreplace",
									"visualblocks",
									"code",
									"fullscreen",
									"insertdatetime",
									"media",
									"table",
									"code",
									"help",
									"wordcount",
								],
								toolbar:
									"undo redo | blocks | " +
									"bold italic forecolor | alignleft aligncenter " +
									"alignright alignjustify | bullist numlist outdent indent | " +
									"removeformat | help",
								content_style:
									"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
							}}
							onEditorChange={(newContent) => setEditedDescription(newContent)}
							onBlur={handleSave}
						/>
					</div>
				</div>

				<div className="w-64 flex-shrink-0 pt-10">
					<h4 className="text-text-placeholder mb-3 text-sm font-semibold">
						Opciones
					</h4>
					<div className="space-y-2">
						<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
							<span className="text-lg">➡️</span> Mover
						</button>
						<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
							<span className="text-lg">📄</span> Copiar
						</button>
						<button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
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
