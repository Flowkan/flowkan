import { Server } from "socket.io";
import registerBoardSockets from "./boardSockets";
import registerChatSockets from "./chatSockets";

export default function registerSockets(io: Server) {
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    registerBoardSockets(io, socket);
    registerChatSockets(io, socket);
  });
}
