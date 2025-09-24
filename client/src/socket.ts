import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./hooks/socket/socket";

const URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const socket:Socket<ServerToClientEvents,ClientToServerEvents> = io(URL, {
	path: "/api/socket.io",
	withCredentials: true,
	transports: ["websocket"],
});
