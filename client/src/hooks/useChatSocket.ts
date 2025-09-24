import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useAppSelector } from "../store";
import { getUserLogged } from "../store/profile/selectors";

export interface ChatMessage {
	senderId: number;
	text: string;
	timestamp: string;
	senderAvatar?: string;
	senderName?: string;
}

export function useChatSocket(
	boardId: string | undefined,
	currentUserId: number | undefined,
) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const user = useAppSelector(getUserLogged);

	useEffect(() => {
		if (!boardId || !currentUserId) return;

		if (!socket.connected) socket.connect();

		socket.emit("joinBoardChat", { boardId, userId: currentUserId });

		socket.on("boardChatMessage", (msg: ChatMessage) => {
			setMessages((prev) => [...prev, msg]);
		});

		return () => {
			socket.emit("leaveBoardChat", { boardId, userId: currentUserId });
			socket.off("boardChatMessage");
		};
	}, [boardId, currentUserId]);

	const sendMessage = (text: string) => {
		if (!boardId || !currentUserId) return;
		const msg: ChatMessage = {
			senderId: currentUserId,
			text,
			timestamp: new Date().toISOString(),
			senderAvatar: user?.photo,
			senderName: user?.name,
		};
		socket.emit("boardChatMessage", { boardId, message: msg });
	};

	return { messages, sendMessage };
}
