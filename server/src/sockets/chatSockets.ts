import { Server, Socket } from "socket.io";

export default function registerChatSockets(io: Server, socket: Socket) {
  socket.on("joinBoardChat", ({ boardId, userId }) => {
    const room = `board-${boardId}`;
    socket.join(room);
  });

  socket.on("leaveBoardChat", ({ boardId, userId }) => {
    const room = `board-${boardId}`;
    socket.leave(room);
  });

  socket.on("boardChatMessage", ({ boardId, message }) => {
    const room = `board-${boardId}`;
    io.to(room).emit("boardChatMessage", message);
  });
}
