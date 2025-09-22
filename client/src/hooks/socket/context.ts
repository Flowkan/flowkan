import { createContext, useContext } from "react";
import { socket } from "../../socket";
import type { Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./socket";

export const SocketContext = createContext<
    Socket<ServerToClientEvents,ClientToServerEvents>
>(socket)

export const useSocket = () => {
    const socketInstance = useContext(SocketContext);
    return socketInstance
}