import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Label, Task } from "../pages/boards/types";
import type { User } from "../pages/login/types";
import { createLabel, getBoardUsers } from "../pages/boards/service";
import { Avatar } from "./ui/Avatar";
import {
	useAddAssigneeAction,
	useAddLabelAction,
	useRemoveAssigneeAction,
	useRemoveLabelAction,
} from "../store/boards/hooks";
import type { Editor as TinyMCEEditor } from "tinymce";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
import { Button } from "./ui/Button";
import { useTranslation } from "react-i18next";
import { useAI } from "../hooks/useAI";
import { CustomToast } from "./CustomToast";
import toast from "react-hot-toast";
import { SpinnerLoadingText } from "./ui/Spinner";
import { getContrastColor } from "../lib/colorUtils";
import ConfirmDelete from "./ui/modals/confirm-delete";
import { useDismiss } from "../hooks/useDismissClickAndEsc";

interface TaskDetailModalProps {
	isOpen: boolean;
	task: Task;
	columnId: string;
	boardId?: string;
	onClose: () => void;
	onEditTask: (
		updatedFields: { title?: string; description?: string } | FormData,
	) => void;
	onDeleteTask: (columnId: string, taskId: string) => void;
}

const NewLabelForm: React.FC<{
	boardId: string;
	onCreated: (label: Label) => void;
}> = ({ boardId, onCreated }) => {
	const [name, setName] = useState("");
	const [color, setColor] = useState("#cccccc");

	const handleCreate = async () => {
		const newLabel = await createLabel(boardId, { name, color });
		onCreated(newLabel);
		setName("");
	};

	return (
		<div className="flex gap-2">
			<input
				type="color"
				value={color}
				onChange={(e) => setColor(e.target.value)}
				className="h-10 w-10 rounded border p-0"
			/>
			<input
				type="text"
				value={name}
				placeholder="Nombre"
				onChange={(e) => setName(e.target.value)}
				className="flex-grow rounded border px-2"
			/>
			<Button onClick={handleCreate}>
				<Icon icon="mdi:plus" />
			</Button>
		</div>
	);
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
	task,
	columnId,
	boardId,
	isOpen,
	onClose,
	onEditTask,
	onDeleteTask,
}) => {
	const addAssignee = useAddAssigneeAction();
	const { open, ref } = useDismiss<HTMLDivElement>(isOpen);
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

	// Estado para el modal de confirmación
	const [confirmMessage, setConfirmMessage] = useState("");
	const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);

	const contentInputRef = useRef<HTMLInputElement>(null);
	const usersRef = useRef<HTMLDivElement>(null);
	const addMenuRef = useRef<HTMLDivElement>(null);
	const { t: translate } = useTranslation();
	const editorRef = useRef<TinyMCEEditor | null>(null);
	const [showLabels, setShowLabels] = useState(false);
	const [labels, setLabels] = useState<Label[]>([]);
	const addLabelAction = useAddLabelAction();
	const removeLabelAction = useRemoveLabelAction();

	const {
		generateDescriptionFromTitle,
		loading,
		stopGenerationDescription,
		error,
	} = useAI();

	useEffect(() => {
		if (contentInputRef.current) contentInputRef.current.focus();
	}, []);

	const handleSaveTitle = useCallback(() => {
		if (editedContent.trim() !== (task.title || "").trim()) {
			onEditTask({ title: editedContent.trim() });
		}
	}, [editedContent, onEditTask, task.title]);

	const handleSaveDescription = useCallback(() => {
		if (editedDescription.trim() !== (task.description || "").trim()) {
			onEditTask({ description: editedDescription.trim() });
		}
	}, [editedDescription, onEditTask, task.description]);

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
			console.error(translate("board.micError"), error);
			alert(translate("board.micAlert"));
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
		setConfirmMessage(translate("board.deleteAttachment"));
		setConfirmAction(() => () => {
			if (!task.id) return;
			onEditTask({ removeMediaId: mediaId } as unknown as {
				title?: string;
				description?: string;
			});
		});
	};

	const handleClose = useCallback(() => {
		const updatedFields: { title?: string; description?: string } = {};
		if (editedContent.trim() !== (task.title || "").trim()) {
			updatedFields.title = editedContent.trim();
		}
		if (editedDescription.trim() !== (task.description || "").trim()) {
			updatedFields.description = editedDescription.trim();
		}

		if (Object.keys(updatedFields).length > 0) {
			toast.custom((t) => (
				<CustomToast message="Cambios guardados" type="success" t={t} />
			));
		}
		handleSaveTitle();
		handleSaveDescription();
		onClose();
	}, [
		editedContent,
		editedDescription,
		handleSaveDescription,
		handleSaveTitle,
		onClose,
		task.description,
		task.title,
	]);

	useEffect(() => {
		if (!open && isOpen) {
			handleClose();
		}
	}, [open, isOpen, handleClose]);

	useEffect(() => {
		if (error) {
			toast.custom((t) => (
				<CustomToast
					message="Limite de peticiones alcanzado"
					t={t}
					type="error"
				/>
			));
		}
	});

	const handleDelete = () => {
		setConfirmMessage(translate("board.deleteTask"));
		setConfirmAction(() => () => {
			onDeleteTask(columnId, task.id!.toString());
			onClose();
		});
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

	const handleGenerateWithAI = async () => {
		if (!task.title) return;
		setEditedDescription("");
		try {
			await generateDescriptionFromTitle(task.title, (description: string) => {
				setEditedDescription(
					`${description}<p><em>${translate("board.createdFrom")}</em></p><br>`,
				);
			});
			handleSaveDescription();
		} catch (error) {
			toast.custom((t) => (
				<CustomToast
					message={translate("boardModal.AI.error", { error: error })}
					type="error"
					t={t}
				/>
			));
		}
	};

	// Scroll automático al final del contenido del Editor de Tiny
	useEffect(() => {
		if (!isOpen) return;
		editorRef.current?.iframeElement?.contentDocument?.body?.lastElementChild?.scrollIntoView(
			{ behavior: "smooth" },
		);
	}, [editedDescription, isOpen]);

	useEffect(() => {
		if (!showUsers) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				usersRef.current &&
				!usersRef.current.contains(event.target as Node)
			) {
				setShowUsers(false);
			}
		};

		const handleEsc = (event: KeyboardEvent) => {
			if (event.key === "Escape") setShowUsers(false);
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEsc);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEsc);
		};
	}, [showUsers]);

	return (
		<>
			<div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
				<div
					ref={ref}
					className="bg-background-card relative flex max-h-5/6 w-full max-w-5xl flex-col overflow-y-auto rounded-lg p-6 shadow-2xl md:flex-row"
				>
					<Button
						onClick={handleClose}
						className="text-text-placeholder hover:text-text-body absolute top-3 right-3 z-10 text-4xl leading-none"
						title={translate("board.closeSaveBtn")}
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
								{translate("board.addToTask")}
							</h4>
							<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
								<div className="relative" ref={addMenuRef}>
									<Button
										onClick={() => setShowAddMenu((prev) => !prev)}
										className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
									>
										<Icon icon="mdi:plus" className="text-lg" />
										{translate("board.add")}
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
												{translate("board.attachDocument")}
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
												{translate("board.attachVoice")}
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
									{translate("board.labels")}
								</Button>
								<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
									<Icon icon="mdi:calendar-month-outline" className="text-lg" />{" "}
									{translate("board.dates")}
								</Button>
								<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200">
									<Icon icon="mdi:checkbox-outline" className="text-lg" />{" "}
									{translate("board.checklist")}
								</Button>
								<Button
									onClick={handleToggleUsers}
									className="bg-background-light-grey text-text-body hover:bg-background-hover-column relative flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
								>
									<Icon icon="mdi:account-group-outline" className="text-lg" />{" "}
									{translate("board.members")}
								</Button>
								<Button
									onClick={
										loading ? stopGenerationDescription : handleGenerateWithAI
									}
									className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex items-center gap-1 rounded-md px-3 py-2 text-sm transition-colors duration-200"
								>
									<Icon icon="mdi:robot" className="text-lg" />
									{loading ? (
										<SpinnerLoadingText
											text={translate("boardModal.AI.btnLoading-On")}
										/>
									) : (
										translate("boardModal.AI.btnLoading-Off")
									)}
									{loading && (
										<span
											className="absolute right-2 flex cursor-pointer items-center justify-center"
											onClick={(e) => {
												e.stopPropagation();
												stopGenerationDescription();
												handleSaveDescription();
											}}
										>
											<Icon
												icon="oui:stop-filled"
												width="16"
												height="16"
												style={{ color: "#a21717" }}
											/>
										</span>
									)}
								</Button>
							</div>

							{showUsers && (
								<div
									ref={usersRef}
									className="border-border-medium bg-background-light-grey absolute top-full left-1/2 z-50 mt-2 max-h-60 w-[calc(100%-1rem)] -translate-x-1/2 overflow-y-auto rounded-md border p-2 shadow-lg md:right-0 md:w-64"
								>
									<input
										type="text"
										placeholder={translate("board.lookforMembers")}
										value={searchTerm}
										onChange={handleSearchChange}
										className="mb-2 w-full rounded-md border p-1 text-sm outline-none"
									/>
									{loadingUsers && (
										<p className="text-center text-sm">
											{translate("board.loadUsers")}
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
									{translate("board.members")}
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

						<div className="bg-gray/20 mb-6 flex flex-col">
							<h4 className="text-text-heading mb-2 flex items-center gap-2 font-semibold">
								<Icon
									icon="mdi:note-edit-outline"
									className="text-text-placeholder text-lg"
								/>
								{translate("board.description")}
							</h4>
							<Editor
								apiKey={import.meta.env.VITE_TINY_MCE}
								onInit={(_evt, editor) => (editorRef.current = editor)}
								value={editedDescription}
								init={{
									height: 400,
									content_css: "document, dark",
									skin: "oxide",
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
								onEditorChange={(newContent) =>
									setEditedDescription(newContent)
								}
								onBlur={handleSaveDescription}
							/>
						</div>

						{task.media && task.media.length > 0 && (
							<div className="mb-6">
								<h4 className="text-text-heading mb-2 text-sm font-semibold">
									{translate("board.attatchments.title")}
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
																className="h-8 w-58"
															>
																<track
																	kind="captions"
																	label={translate(
																		"board.attatchments.audio.label",
																	)}
																	src=""
																	default
																/>
																{translate("board.attatchments.audio.msg")}
															</audio>
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
																	title={translate("board.attatchments.media", {
																		fileName: mediaItem.fileName,
																	})}
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
													title={translate("board.attatchments.delete")}
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
									{translate("board.recording")}
								</span>
								<Button
									onClick={handleStopRecording}
									className="rounded bg-white px-3 py-1 text-sm font-semibold text-red-600 hover:bg-gray-200"
								>
									{translate("board.stop")}
								</Button>
							</div>
						)}

						{showLabels && (
							<div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
								<div className="w-80 rounded-lg bg-white p-4 shadow-lg">
									<h3 className="mb-2 font-semibold">
										{translate("board.labels", "Etiquetas")}
									</h3>

									<div className="mb-4 space-y-2">
										{labels.map((label) => {
											const isAssigned = task.labels?.some(
												(l) => l.id === label.id,
											);
											return (
												<button
													type="button"
													key={label.id}
													onClick={() => {
														if (isAssigned && task.id && label.id) {
															removeLabelAction(
																task.id?.toString(),
																label.id.toString(),
															);
														} else if (task.id && label.id) {
															addLabelAction(
																task.id.toString(),
																label.id.toString(),
															);
														}
													}}
													className={`relative flex items-center justify-center rounded-md p-2 transition-colors duration-200 focus:outline-none ${
														isAssigned
															? "ring-2 ring-black"
															: "hover:opacity-80"
													}`}
													style={{
														backgroundColor: label.color,
														cursor: "pointer",
													}}
													aria-pressed={isAssigned}
												>
													<span
														className="font-medium"
														style={{ color: getContrastColor(label.color) }}
													>
														{label.name}
													</span>

													{isAssigned && (
														<Icon
															icon="mdi:check"
															className={`absolute top-1/2 right-2 -translate-y-1/2 text-xl`}
															style={{ color: getContrastColor(label.color) }}
														/>
													)}
												</button>
											);
										})}
									</div>

									<NewLabelForm
										boardId={boardId!}
										onCreated={(l) => setLabels((prev) => [...prev, l])}
									/>

									<Button
										onClick={() => setShowLabels(false)}
										className="mt-4 w-full"
									>
										{translate("board.close", "Cerrar")}
									</Button>
								</div>
							</div>
						)}
					</div>

					<div className="w-full flex-shrink-0 pt-6 md:w-64 md:pt-10">
						<h4 className="text-text-placeholder mb-3 text-sm font-semibold">
							{translate("board.options")}
						</h4>
						<div className="space-y-2">
							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon icon="mdi:arrow-right-box" className="text-lg" />
								{translate("board.move")}
							</Button>
							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon icon="mdi:content-copy" className="text-lg" />
								{translate("board.copy")}
							</Button>
							<Button className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200">
								<Icon
									icon="mdi:archive-arrow-down-outline"
									className="text-lg"
								/>{" "}
								{translate("board.archive")}
							</Button>
							<Button
								className="bg-background-light-grey text-text-body hover:bg-background-hover-column flex w-full items-center justify-start gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-200"
								onClick={handleDelete}
							>
								<Icon icon="mdi:trash-can-outline" className="text-lg" />
								{translate("board.delete")}
							</Button>
						</div>
					</div>
				</div>
			</div>
			{confirmMessage && (
				<ConfirmDelete
					handleDeleteBoard={() => {
						confirmAction();
						setConfirmMessage("");
					}}
					handleHideMessage={() => setConfirmMessage("")}
					message={confirmMessage}
				/>
			)}
		</>
	);
};

export default TaskDetailModal;
