import { useState, useRef, useEffect } from "react";
import {
	useChatSocket,
	type ChatMessage,
} from "../../hooks/socket/useChatSocket";
import { Icon } from "@iconify/react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useDismiss } from "../../hooks/useDismissClickAndEsc";
import { useAppSelector } from "../../store";
import { getUserLogged } from "../../store/profile/selectors";
import { useTranslation } from "react-i18next";
import { useAI } from "../../hooks/useAI";
import { formattedToHTML } from "../../utils/formatted";

interface ChatWindowProps {
	readonly boardId: string;
	readonly onAddTask?: (
		columnId: number,
		title: string,
		description: string,
	) => void;
}

const notificationSound = new Audio("/notification.mp3");

export function ChatWindow({ boardId, onAddTask }: ChatWindowProps) {
	const { messages, sendMessage, unreadCount, resetUnreadCount } =
		useChatSocket(boardId);
	const [text, setText] = useState("");
	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
	const user = useAppSelector(getUserLogged);
	const { t } = useTranslation();
	const [isAgentMode, setIsAgentMode] = useState(false);
	const { generateDescriptionFromTitle, loading, error } = useAI();

	const messagesEndRef = useRef<HTMLDivElement>(null);

	const prevUnreadCountRef = useRef(unreadCount);

	useEffect(() => {
		const isNewMessageReceived = unreadCount > prevUnreadCountRef.current;

		if (!open && isNewMessageReceived) {
			notificationSound.currentTime = 0;
			notificationSound.play().catch((error) => {
				console.warn(
					"No se pudo reproducir el sonido (posiblemente por restricción de autoplay): ",
					error,
				);
			});
		}

		prevUnreadCountRef.current = unreadCount;
	}, [open, unreadCount]);

	useEffect(() => {
		if (open) {
			resetUnreadCount();
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}
	}, [messages, open, resetUnreadCount]);

	const handleSend = async () => {
		if (!text.trim()) return;
		if (isAgentMode && onAddTask) {
			try {
				const generated = await generateDescriptionFromTitle(text);
				const formattedText = formattedToHTML(generated || "");
				onAddTask(5, text.trim(), formattedText);
				setText("");
			} catch (err) {
				console.error("Error generando tarea con IA:", err);
			}
		} else {
			sendMessage(text.trim());
			setText("");
		}
	};

	return (
		<div ref={ref}>
			<Button
				onClick={() => setOpen(true)}
				className="bg-primary hover:bg-primary/90 relative flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-full text-white shadow-lg"
			>
				<Icon icon="mdi:message-text" className="h-3 w-3 md:h-5 md:w-5" />
				{!open && unreadCount > 0 && (
					<div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-xs text-white">
						{unreadCount > 9 ? "9+" : unreadCount}
					</div>
				)}
			</Button>

			{open && (
				<div className="fixed right-0 bottom-0 z-50 flex h-[70vh] w-full flex-col rounded-t-lg border bg-white shadow-lg sm:right-4 sm:bottom-4 sm:h-96 sm:w-80 sm:rounded-lg">
					<div className="flex items-center justify-between border-b p-2">
						<span className="font-bold">{t("chat.title")}</span>
						<button onClick={() => setOpen(false)}>
							<Icon
								icon="mdi:close"
								className="h-5 w-5 text-gray-600 hover:text-gray-800"
							/>
						</button>
					</div>

					<div className="flex items-center justify-between border-b px-3 py-2 text-sm">
						{" "}
						<span>Modo agente</span>{" "}
						<label className="inline-flex cursor-pointer items-center">
							{" "}
							<input
								type="checkbox"
								className="sr-only"
								checked={isAgentMode}
								onChange={() => setIsAgentMode((prev) => !prev)}
							/>{" "}
							<div
								className={`h-5 w-10 rounded-full ${isAgentMode ? "bg-blue-600" : "bg-gray-300"} relative transition`}
							>
								{" "}
								<div
									className={`absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white transition-transform ${isAgentMode ? "translate-x-5" : "translate-x-0"}`}
								></div>{" "}
							</div>{" "}
						</label>{" "}
					</div>

					<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
						{messages.map((msg: ChatMessage, i: number) => (
							<div
								key={i}
								className={`flex items-end ${
									msg.senderId === user?.id ? "justify-end" : "justify-start"
								}`}
							>
								{msg.senderId !== user?.id && (
									<Avatar
										name={msg.senderName || ""}
										photo={msg.senderAvatar}
										size={28}
									/>
								)}

								<div
									className={`inline-block max-w-[80%] rounded px-2 py-1 text-sm ${
										msg.senderId === user?.id
											? "bg-primary text-white"
											: "bg-gray-200 text-gray-800"
									}`}
								>
									{msg.text}
									<span className="mt-1 block text-right text-[10px] opacity-70">
										{new Date(msg.timestamp).toLocaleTimeString()}
									</span>
								</div>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>

					<div className="flex border-t">
						<input
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSend()}
							className="flex-grow px-2 py-2 text-sm outline-none"
							placeholder={t("chat.input")}
						/>
						<button
							onClick={handleSend}
							className="bg-primary hover:bg-primary/90 rounded-r px-4 text-white"
						>
							{loading ? "IA..." : t("chat.send")}
						</button>
					</div>
					{error && <p className="px-3 py-1 text-xs text-red-500">{error}</p>}
				</div>
			)}
		</div>
	);
}
