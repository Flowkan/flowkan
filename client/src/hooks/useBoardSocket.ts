import { useEffect, useState } from "react";
import { socket } from "../socket";

interface BoardUser {
	id: number;
	name: string;
	email: string;
	photo?: string | null;
}

export function useBoardSocket(
	boardId: string | undefined,
	userId: number | undefined,
) {
	const [users, setUsers] = useState<BoardUser[]>([]);

	useEffect(() => {
		if (!boardId || !userId) return;

		if (!socket.connected) socket.connect();

		socket.emit("joinBoard", { boardId, userId });

		socket.on("boardUsers", (members: BoardUser[]) => {
			setUsers(members);
		});

		return () => {
			socket.off("boardUsers");
			socket.disconnect();
		};
	}, [boardId, userId]);

	return users;
}
