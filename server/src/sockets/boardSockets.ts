import { Server, Socket } from "socket.io";
import BoardService from "../services/BoardService";
import BoardModel from "../models/BoardModel";
import prisma from "../config/db";
import CardModel from "../models/CardModel";

const boardService = new BoardService(
  new BoardModel(prisma),
  new CardModel(prisma),
);

const onlineUsers: Record<string, { socketId: string; userId: number }[]> = {};

export default function registerBoardSockets(io: Server, socket: Socket) {
  socket.on("joinBoard", async ({ boardId, userId }) => {
    try {
      const usersInBoard = await boardService.getBoardUsers({
        userId,
        boardId,
      });
      const isMember = usersInBoard.some((u) => u.id === userId);

      if (!isMember) {
        console.warn(
          `Usuario ${userId} intentó unirse a tablero ${boardId} sin permisos`,
        );
        return;
      }

      socket.join(boardId);

      if (!onlineUsers[boardId]) onlineUsers[boardId] = [];
      onlineUsers[boardId].push({ socketId: socket.id, userId });

      await emitBoardUsers(io, boardId, userId);
    } catch (error) {
      console.error("Error en joinBoard:", error);
    }
  });

  socket.on("disconnect", async () => {
    try {
      for (const boardId in onlineUsers) {
        const before = onlineUsers[boardId].length;
        onlineUsers[boardId] = onlineUsers[boardId].filter(
          (u) => u.socketId !== socket.id,
        );

        if (before !== onlineUsers[boardId].length) {
          // Emitimos siempre, aunque el tablero quede vacío
          const anyUserId = onlineUsers[boardId]?.[0]?.userId || null;
          await emitBoardUsers(io, boardId, anyUserId);
        }
      }
    } catch (error) {
      console.error("Error en disconnect:", error);
    }
  });
}

async function emitBoardUsers(
  io: Server,
  boardId: string,
  userId: number | null,
) {
  const members = await boardService.getBoardUsers({ boardId });

  const membersWithStatus = members
    .filter((m) => onlineUsers[boardId]?.some((ou) => ou.userId === m.id))
    .map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      photo: m.photo,
    }));

  io.to(boardId).emit("boardUsers", membersWithStatus);
}
