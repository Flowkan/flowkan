import { Server, Socket } from "socket.io";
import registerBoardSockets, { handleMoveTask } from "./boardSockets";
import UserHandler from "./handlers/user";
import { ServerBoard, ServerUser, SocketBoard, SocketUser } from "./types";

import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import BoardHandler from "./handlers/board";

// type ServerUser = Server<ClientToServerEvents,ServerToClientEvents,Record<string,never>,SocketData>
// type SocketUser = Socket<ClientToServerEvents,ServerToClientEvents,Record<string,never>,SocketData>

export default function registerSockets(io: Server) {
  // io.engine.use(jwtAuth.guard)
  const userHandler = new UserHandler(io as ServerUser)
  const boardHandler = new BoardHandler(io as ServerBoard)
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    // registerBoardSockets(io, socket);
    // handleMoveTask(io,socket)
    userHandler.initialize(socket as SocketUser)
    boardHandler.initialize(socket as SocketBoard)
  });
}
