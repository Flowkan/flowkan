import {
  BoardUser,
  ServerUser,  
  SocketUser,
} from "../types";
import BoardService from "../../services/BoardService";
import BoardModel from "../../models/BoardModel";
import prisma from "../../config/db";

export default class UserHandler {
  private connectedUsers: Map<string, BoardUser> = new Map();
  private boardService = new BoardService(new BoardModel(prisma));
  constructor(
    private io: ServerUser,
  ) {}

  initialize(socket: SocketUser) {
    this.handleUserConnected(socket);

    socket.on("user:update", (userBoard) =>
      this.handleUserUpdate(socket, userBoard),
    );

    socket.on("join:room", (roomId) => this.handleJoinRoom(socket, roomId));

    socket.on("request:users", () => this.handleRequestUsers(socket));

    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private async handleUserConnected(socket: SocketUser) {
    const { boardId } = socket.handshake.auth; 
    const userData = socket.data.user    
    if (!userData || !boardId) {
      console.warn("Datos de autenticación incompletos");
      return;
    }
    const usersInBoard = await this.boardService.getBoardUsers({
      userId: userData.id,
      boardId,
    });

    const isMember = usersInBoard.some((u) => u.id === userData.id);

    if (isMember) {
      this.connectedUsers.set(socket.id, userData);

      this.handleJoinRoom(socket, boardId);
      this.io.to(boardId).emit("user:connected", userData);

      // socket.data.user = userData;
    }else{
      console.warn(`Acceso denegado ${userData.id}, no es miembro del tablero ${boardId}`);      
      socket.emit("error:occurred", { 
        message: "No eres miembro de este tablero.",
        code:"ACCESS_DENIED"
      });
      return;
    }
  }
  private handleUserUpdate(socket: SocketUser, user: BoardUser) {
    if (user) {
      this.connectedUsers.set(socket.id, user);

      // socket.data.user = user;

      socket.broadcast.emit("user:connected", {
        ...user,
      });
    }
  }

  private handleRequestUsers(socket: SocketUser) {
    socket.emit("users:list", this.getConnectedUsers());
  }

  private handleJoinRoom(socket: SocketUser, roomId: string) {
    if (socket.data.room) {
      socket.leave(socket.data.room);
    }

    socket.join(roomId);
    socket.data.room = roomId;

    if (socket.data.user) {
      socket.to(roomId).emit("user:joined", {
        // this.io.to(roomId).emit('user:joined',{
        user: socket.data.user,
        roomId,
      });
    }
  }

  private handleDisconnect(socket: SocketUser) {
    if (socket.data.room && socket.data.user) {
        //Asegura que el usuario estaba en la sala
      if (socket.rooms.has(socket.data.room)) {
        this.io
          .to(socket.data.room)
          .emit("user:disconnected", socket.data.user);
      }
    }
    //Eliminar de usuarios conectados
    this.connectedUsers.delete(socket.id);
  }

  //Obtener usuarios en linea
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}
