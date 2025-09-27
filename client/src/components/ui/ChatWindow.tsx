import { useState } from "react";
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

interface ChatWindowProps {
	readonly boardId: string;
}

export function ChatWindow({ boardId }: ChatWindowProps) {
	const { messages, sendMessage } = useChatSocket(boardId);
	const [text, setText] = useState("");
	const { open, setOpen, ref } = useDismiss<HTMLDivElement>();
	const user = useAppSelector(getUserLogged);

	const handleSend = () => {
		if (text.trim()) {
			sendMessage(text.trim());
			setText("");
		}
	};

	return (
		<div ref={ref}>
			<Button
				onClick={() => setOpen(true)}
				className="bg-primary hover:bg-primary/90 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white shadow-lg md:h-9 md:w-9"
			>
				<Icon icon="mdi:message-text" className="h-5 w-5 md:h-6 md:w-6" />
			</Button>

			{open && (
				<div className="fixed right-0 bottom-0 z-50 flex h-[70vh] w-full flex-col rounded-t-lg border bg-white shadow-lg sm:right-4 sm:bottom-4 sm:h-96 sm:w-80 sm:rounded-lg">
					<div className="flex items-center justify-between border-b p-2">
						<span className="font-bold">Chat del tablero</span>
						<button onClick={() => setOpen(false)}>
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
									msg.senderId === user?.id ? "justify-end" : "justify-start"
								}`}
							>
								{msg.senderId !== user?.id && msg.senderAvatar && (
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
		</div>
	);
}
