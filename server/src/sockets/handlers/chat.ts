import { ChatMessage, ServerUser, SocketUser } from "../types";

export default class ChatHandler {
  private readonly chatHistory: Map<string, ChatMessage[]> = new Map();

  constructor(private readonly io: ServerUser) {}

  initialize(socket: SocketUser) {
    socket.on("board:joinChat", (payload) =>
      this.handleJoinChat(socket, payload.boardId, payload.userId),
    );

    socket.on("board:leaveChat", (payload) =>
      this.handleLeaveChat(socket, payload.boardId, payload.userId),
    );

    socket.on("board:chatMessage", (payload) =>
      this.handleChatMessage(socket, payload.boardId, payload.message),
    );
  }

  private handleJoinChat(socket: SocketUser, boardId: string, userId: number) {
    if (!socket.data.user || socket.data.user.id !== userId) {
      socket.emit("error:occurred", {
        code: "ACCESS_DENIED",
        message: "No autorizado para unirse al chat.",
      });
      return;
    }

    socket.join(`chat:${boardId}`);

    // Enviar historial al usuario que entra
    const history = this.chatHistory.get(boardId) ?? [];
    socket.emit("chat:history", history);
  }

  private handleLeaveChat(socket: SocketUser, boardId: string, userId: number) {
    if (!socket.data.user || socket.data.user.id !== userId) return;

    socket.leave(`chat:${boardId}`);
  }

  private handleChatMessage(
    socket: SocketUser,
    boardId: string,
    message: ChatMessage,
  ) {
    if (!socket.data.user || socket.data.user.id !== message.senderId) {
      socket.emit("error:occurred", {
        code: "ACCESS_DENIED",
        message: "No autorizado para enviar mensajes.",
      });
      return;
    }

    // Guardar mensaje en historial
    const history = this.chatHistory.get(boardId) ?? [];
    history.push(message);
    this.chatHistory.set(boardId, history.slice(-50)); // solo últimos 50

    // Reenviar mensaje a todos en la sala
    this.io.to(`chat:${boardId}`).emit("board:chatMessage", message);
  }
}
