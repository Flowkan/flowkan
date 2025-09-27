import { Server, Socket } from "socket.io";

export default function registerChatSockets(io: Server, socket: Socket) {
  socket.on("joinBoardChat", ({ boardId, userId }) => {
    const room = `board-${boardId}`;
    socket.join(room);
    console.log(`Usuario ${userId} se unió al chat del tablero ${boardId}`);
  });

  socket.on("leaveBoardChat", ({ boardId, userId }) => {
    const room = `board-${boardId}`;
    socket.leave(room);
    console.log(`Usuario ${userId} salió del chat del tablero ${boardId}`);
  });

  socket.on("boardChatMessage", ({ boardId, message }) => {
    const room = `board-${boardId}`;
    io.to(room).emit("boardChatMessage", message);
    console.log(`Mensaje en tablero ${boardId}:`, message);
  });
}
