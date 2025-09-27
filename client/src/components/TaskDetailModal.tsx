import React, { useState, useEffect, useRef } from "react";
import type { Task } from "../pages/boards/types";
import type { User } from "../pages/login/types";
import { getBoardUsers } from "../pages/boards/service";
import { Avatar } from "./ui/Avatar";
import {
	useAddAssigneeAction,
	useRemoveAssigneeAction,
} from "../store/boards/hooks";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";

interface TaskDetailModalProps {
	task: Task;
	columnId: string;
	boardId?: string;
	onClose: () => void;
	onEditTask: (
		updatedFields: { title?: string; description?: string } | FormData,
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

	const [recording, setRecording] = useState(false);
	const [showAddMenu, setShowAddMenu] = useState(false);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);

	const modalRef = useRef<HTMLDivElement>(null);
	const contentInputRef = useRef<HTMLInputElement>(null);
	const usersRef = useRef<HTMLDivElement>(null);
	const addMenuRef = useRef<HTMLDivElement>(null);
	const editorRef = useRef(null);
	const { t } = useTranslation();

	useEffect(() => {
		if (contentInputRef.current) contentInputRef.current.focus();
	}, []);

	const handleSaveTitle = () => {
		if (editedContent.trim() !== (task.title || "").trim()) {
			onEditTask({ title: editedContent.trim() });
		}
	};

	const handleSaveDescription = () => {
		if (editedDescription.trim() !== (task.description || "").trim()) {
			onEditTask({ description: editedDescription.trim() });
		}
	};

	const handleUploadAttachments = (filesToUpload: (File | Blob)[]) => {
		if (!task.id || filesToUpload.length === 0) return;

		const formData = new FormData();

		filesToUpload.forEach((fileOrBlob, index) => {
			const fileName =
				fileOrBlob instanceof File
					? fileOrBlob.name
					: `nota_voz_${Date.now()}_${index}.webm`;

			formData.append("attachments", fileOrBlob, fileName);
		});

		onEditTask(formData);
		setShowAddMenu(false);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newFiles = Array.from(e.target.files);
			handleUploadAttachments(newFiles);
			e.target.value = "";
		}
	};

	const handleStartRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;
			const chunks: Blob[] = [];

			mediaRecorder.ondataavailable = (event) => {
				if (event.data.size > 0) chunks.push(event.data);
			};

			mediaRecorder.onstop = () => {
				const audioBlob = new Blob(chunks, { type: "audio/webm" });
				handleUploadAttachments([audioBlob]);
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorder.start();
			setRecording(true);
		} catch (error) {
			console.error("Error al acceder al micrófono:", error);
			alert(
				"No se pudo iniciar la grabación. Asegúrate de que el micrófono esté disponible.",
			);
			setRecording(false);
		}
	};

	const handleStopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state !== "inactive"
		) {
			mediaRecorderRef.current.stop();
		}
		setRecording(false);
	};

	const handleRemoveAttachment = (mediaId: number) => {
		if (!task.id) return;

		if (window.confirm("¿Estás seguro de que quieres eliminar este adjunto?")) {
			onEditTask({ removeMediaId: mediaId } as unknown as {
				title?: string;
				description?: string;
			});
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				modalRef.current &&
				!modalRef.current.contains(target) &&
				!(target as HTMLElement).closest(".tox")
			) {
				onClose();
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [onClose]);

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

	useEffect(() => {
		if (!showAddMenu) return;
		const handleClickOutsideAdd = (event: MouseEvent) => {
			if (
				addMenuRef.current &&
				!addMenuRef.current.contains(event.target as Node)
			) {
				setShowAddMenu(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutsideAdd);
		return () =>
			document.removeEventListener("mousedown", handleClickOutsideAdd);
	}, [showAddMenu]);

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
				className="bg-background-card relative flex max-h-5/6 w-full max-w-5xl flex-col overflow-y-auto rounded-lg p-6 shadow-2xl md:flex-row"
			>
				<Button
					onClick={() => {
						onClose();
					}}
					className="text-text-placeholder hover:text-text-body absolute top-3 right-3 z-10 text-4xl leading-none"
					title="Cerrar y guardar"
				>
					<Icon icon="ic:round-close" className="text-3xl" />
				</Button>

				<div className="relative flex flex-grow flex-col md:mr-6">
					<div className="mb-4 flex items-center gap-2">
						<Icon
							icon="mdi:card-bulleted-settings-outline"
							className="text-text-placeholder text-2xl"
						/>
						<input
							ref={contentInputRef}
							type="text"
							value={editedContent}
							onChange={(e) => setEditedContent(e.target.value)}
							onBlur={handleSaveTitle}
							className="border-border-medium focus:border-accent w-full border-b bg-transparent text-2xl font-bold outline-none"
						/>
					</div>

					<div className="relative mb-6">
						<h4 className="text-text-placeholder mb-2 text-sm font-semibold">
							{t("board.add_to_task", "Añadir a la tarjeta")}
						</h4>
						<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
							<div className="relative" ref={addMenuRef}>
								<Button
									onClick={() => setShowAddMenu((prev) => !prev)}
									className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
								>
									<Icon icon="mdi:plus" className="text-lg" />
									{t("board.add", "Añadir")}
								</Button>

								{showAddMenu && (
									<div className="border-border-medium bg-background-light-grey absolute top-full left-0 z-50 mt-2 w-56 rounded-md border shadow-lg">
										<Button
											onClick={() => {
												document.getElementById("fileInput")?.click();
												setShowAddMenu(false);
											}}
											className="hover:bg-background-hover-column w-full px-3 py-2 text-left text-sm"
										>
											<Icon
												icon="mdi:attachment"
												className="mr-1 inline-block text-lg"
											/>
											{t("board.attach_document", "Adjuntar documento")}
										</Button>
										<Button
											onClick={() => {
												if (!recording) handleStartRecording();
												setShowAddMenu(false);
											}}
											className="hover:bg-background-hover-column w-full px-3 py-2 text-left text-sm"
										>
											<Icon
												icon="mdi:microphone"
												className="mr-1 inline-block text-lg"
											/>
											{t("board.attach_voice", "Grabar nota de voz")}
										</Button>
									</div>
								)}
								<input
									id="fileInput"
									type="file"
									multiple
									className="hidden"
									onChange={handleFileChange}
								/>
							</div>

							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon icon="mdi:tag-outline" className="text-lg" />{" "}
								{t("board.labels", "Etiquetas")}
							</Button>
							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon icon="mdi:calendar-month-outline" className="text-lg" />{" "}
								{t("board.dates", "Fechas")}
							</Button>
							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon icon="mdi:checkbox-outline" className="text-lg" />{" "}
								{t("board.checklist", "Checklist")}
							</Button>
							<Button
								onClick={handleToggleUsers}
								className="bg-background-light-grey text-text-body hover:bg-background-hover-column relative flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
							>
								<Icon icon="mdi:account-group-outline" className="text-lg" />{" "}
								{t("board.members", "Miembros")}
							</Button>
						</div>

						{showUsers && (
							<div
								ref={usersRef}
								className="border-border-medium bg-background-light-grey absolute top-full left-1/2 z-50 mt-2 max-h-60 w-[calc(100%-1rem)] -translate-x-1/2 overflow-y-auto rounded-md border p-2 shadow-lg md:right-0 md:w-64"
							>
								<input
									type="text"
									placeholder="Buscar miembros..."
									value={searchTerm}
									onChange={handleSearchChange}
									className="mb-2 w-full rounded-md border p-1 text-sm outline-none"
								/>
								{loadingUsers && (
									<p className="text-center text-sm">
										{t("board.load_users", "Cargando usuarios...")}
									</p>
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
											{isAssigned && (
												<Icon icon="mdi:check" className="ml-auto text-xs" />
											)}
										</div>
									);
								})}
							</div>
						)}
					</div>

					{assignedUsers.length > 0 && (
						<div className="mb-6">
							<h4 className="text-text-heading mb-2 text-sm font-semibold">
								{t("board.members", "Miembros")}
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
							<Icon
								icon="mdi:note-edit-outline"
								className="text-text-placeholder text-lg"
							/>
							{t("board.description", "Descripción")}
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
							onBlur={handleSaveDescription}
						/>
					</div>

					{task.media && task.media.length > 0 && (
						<div className="mb-6">
							<h4 className="text-text-heading mb-2 text-sm font-semibold">
								{t("board.attatchments", "Adjuntos")}
							</h4>
							<div className="space-y-2">
								{task.media.map((mediaItem) => {
									return (
										<div
											key={mediaItem.id}
											className="border-border-medium bg-background-light-grey flex items-center justify-between rounded-md border px-3 py-2 text-sm shadow-sm"
										>
											<div className="flex items-center gap-2">
												{mediaItem.fileType === "audio" ? (
													<>
														<Icon icon="mdi:microphone" className="text-lg" />
														<audio
															controls
															src={`${import.meta.env.VITE_BASE_URL}${mediaItem.url}`}
															className="h-8"
														/>
													</>
												) : (
													<>
														<Icon
															icon="mdi:file-document-outline"
															className="text-lg"
														/>
														<div key={mediaItem.id}>
															<a
																href={`${import.meta.env.VITE_BASE_URL}${mediaItem.url}`}
																target="_blank"
																rel="noopener noreferrer"
																title={`Ver ${mediaItem.fileName}`}
															>
																{mediaItem.fileName}
															</a>
														</div>
													</>
												)}
											</div>
											<button
												onClick={() => handleRemoveAttachment(mediaItem.id)}
												className="text-text-placeholder hover:text-red-500"
												title="Eliminar archivo"
											>
												<Icon
													icon="mdi:close-circle-outline"
													className="text-lg"
												/>
											</button>
										</div>
									);
								})}
							</div>
						</div>
					)}

					{recording && (
						<div className="fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-md -translate-x-1/2 items-center justify-between rounded-lg bg-red-600 px-4 py-3 text-white shadow-lg">
							<span className="flex items-center gap-2">
								<Icon icon="mdi:record-circle" className="animate-pulse" />{" "}
								{t("board.recording", "Grabando...")}
							</span>
							<Button
								onClick={handleStopRecording}
								className="rounded bg-white px-3 py-1 text-sm font-semibold text-red-600 hover:bg-gray-200"
							>
								{t("board.stop", "Detemer")}
							</Button>
						</div>
					)}
				</div>

				<div className="w-full flex-shrink-0 pt-6 md:w-64 md:pt-10">
					<h4 className="text-text-placeholder mb-3 text-sm font-semibold">
						{t("board.options", "Opciones")}
					</h4>
					<div className="space-y-2">
						<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
							<Icon icon="mdi:arrow-right-box" className="text-lg" />
							{t("board.move", "Mover")}
						</Button>
						<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
							<Icon icon="mdi:content-copy" className="text-lg" />
							{t("board.copy", "Copiar")}
						</Button>
						<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
							<Icon icon="mdi:archive-arrow-down-outline" className="text-lg" />{" "}
							{t("board.archive", "Archivar")}
						</Button>
						<Button
							className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200"
							onClick={handleDelete}
						>
							<Icon icon="mdi:trash-can-outline" className="text-lg" />
							{t("board.delete", "Eliminar")}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskDetailModal;
