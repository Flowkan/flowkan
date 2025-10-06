import { useEffect, useState } from "react";
import { useSocket } from "./context";
import { useAppSelector } from "../../store";
import { getUserLogged } from "../../store/profile/selectors";

export interface ChatMessage {
	senderId: number;
	text: string;
	timestamp: string;
	senderAvatar?: string;
	senderName?: string;
}

export function useChatSocket(boardId: string) {
	const socket = useSocket();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const user = useAppSelector(getUserLogged);

	useEffect(() => {
		if (!boardId || !user?.id) {
			setMessages([]);
			setUnreadCount(0);
			return;
		}

		const handleIncomingMessage = (msg: ChatMessage) => {
			setMessages((prev) => [...prev, msg]);
			setUnreadCount((prev) => prev + 1);
		};

		const handleHistory = (msgs: ChatMessage[]) => {
			setMessages((prev) => [...msgs, ...prev]);
		};

		socket.emit("board:joinChat", { boardId, userId: user.id });

		socket.on("board:chatMessage", handleIncomingMessage);
		socket.on("chat:history", handleHistory);

		return () => {
			socket.off("board:chatMessage", handleIncomingMessage);
			socket.off("chat:history", handleHistory);
			socket.emit("board:leaveChat", { boardId, userId: user.id });
		};
	}, [socket, boardId, user?.id]);

	const sendMessage = (text: string) => {
		if (!boardId || !user?.id) return;

		const msg: ChatMessage = {
			senderId: user.id,
			text,
			timestamp: new Date().toISOString(),
			senderAvatar: user.photo,
			senderName: user.name,
		};

		socket.emit("board:chatMessage", { boardId, message: msg });
	};

	const resetUnreadCount = () => {
		setUnreadCount(0);
	};

	return { messages, sendMessage, unreadCount, resetUnreadCount };
}
