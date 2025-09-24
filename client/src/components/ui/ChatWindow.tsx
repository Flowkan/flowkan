import { useState } from "react";
import { useChatSocket, type ChatMessage } from "../../hooks/useChatSocket";
import { Icon } from "@iconify/react";
import { Avatar } from "./Avatar";

interface ChatWindowProps {
	readonly boardId: string;
	readonly currentUserId: number;
}

export function ChatWindow({ boardId, currentUserId }: ChatWindowProps) {
	const { messages, sendMessage } = useChatSocket(boardId, currentUserId);
	const [text, setText] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const handleSend = () => {
		if (text.trim()) {
			sendMessage(text.trim());
			setText("");
		}
	};

	return (
		<>
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-primary hover:bg-primary/90 fixed right-4 bottom-4 z-50 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg md:h-14 md:w-14"
				>
					<Icon icon="mdi:message-text" className="h-6 w-6 md:h-7 md:w-7" />
				</button>
			)}

			{isOpen && (
				<div className="fixed right-0 bottom-0 z-50 flex h-[70vh] w-full flex-col rounded-t-lg border bg-white shadow-lg sm:right-4 sm:bottom-4 sm:h-96 sm:w-80 sm:rounded-lg">
					<div className="flex items-center justify-between border-b p-2">
						<span className="font-bold">Chat del tablero</span>
						<button onClick={() => setIsOpen(false)}>
							<Icon
								icon="mdi:close"
								className="h-5 w-5 text-gray-600 hover:text-gray-800"
							/>
						</button>
					</div>

					<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
						{messages.map((msg: ChatMessage, i: number) => (
							<div
								key={i}
								className={`flex items-end ${
									msg.senderId === currentUserId
										? "justify-end"
										: "justify-start"
								}`}
							>
								{msg.senderId !== currentUserId && msg.senderAvatar && (
									<Avatar
										name={msg.senderName || ""}
										photo={msg.senderAvatar}
										size={28}
									/>
								)}

								<div
									className={`inline-block max-w-[80%] rounded px-2 py-1 text-sm ${
										msg.senderId === currentUserId
											? "bg-primary text-white"
											: "bg-gray-200 text-gray-800"
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
					</div>

					<div className="flex border-t">
						<input
							value={text}
							onChange={(e) => setText(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSend()}
							className="flex-grow px-2 py-2 text-sm outline-none"
							placeholder="Escribe un mensaje..."
						/>
						<button
							onClick={handleSend}
							className="bg-primary hover:bg-primary/90 rounded-r px-4 text-white"
						>
							Enviar
						</button>
					</div>
				</div>
			)}
		</>
	);
}
