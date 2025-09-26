import { BoardUser, ServerUser, SocketUser } from "../types";
import BoardService from "../../services/BoardService";
import BoardModel from "../../models/BoardModel";
import prisma from "../../config/db";

export default class UserHandler {
  private connectedUsers: Map<string, BoardUser> = new Map();
  private boardService = new BoardService(new BoardModel(prisma));
  constructor(private io: ServerUser) {}

  initialize(socket: SocketUser) {
    this.handleUserConnected(socket);

    socket.on("user:update", (userBoard: BoardUser) =>
      this.handleUserUpdate(socket, userBoard),
    );

    socket.on("join:room", (roomId: string) =>
      this.handleJoinRoom(socket, roomId),
    );

    socket.on("leave:room", (roomId: string) =>
      this.handleLeaveRoom(socket, roomId),
    );

    socket.on("request:users", () => this.handleRequestUsers(socket));

    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  private handleUserConnected(socket: SocketUser) {
    // const { boardId } = socket.handshake.auth;
    const userData = socket.data.user;
    if (!userData) {
      console.warn("Datos de autenticación incompletos");
      return;
    }
    
    this.connectedUsers.set(socket.id, userData);    
  }
  private handleUserUpdate(socket: SocketUser, user: BoardUser) {
    if (user && socket.data.room) {
      this.connectedUsers.set(socket.id, user);

      socket.broadcast.to(socket.data.room).emit("user:connected", {
        ...user,
      });
    }
  }

  private async handleRequestUsers(socket: SocketUser) {
    const roomId = socket.data.room
    if(!roomId){
          socket.emit("users:list", []);      
          return;
    }
    const socketsInRoom = await this.io.in(roomId).fetchSockets();
    const usersInRoom = socketsInRoom.map(sock => sock.data.user) as BoardUser[]
    console.log(usersInRoom);
    
    socket.emit("users:list", usersInRoom);
    
  }

  private async handleJoinRoom(socket: SocketUser, roomId: string) {
    if (socket.data.room) {
      socket.leave(socket.data.room);
    }
    const userData = socket.data.user;
    if (!userData) {
      socket.emit("error:occurred", {
        message: "Problemas de autenticación.",
        code: "ACCESS_DENIED",
      });
      return;
    }

    const usersInBoard = await this.boardService.getBoardUsers({
      userId: userData.id,
      boardId: roomId,
    });

    const isMember = usersInBoard.some((u) => u.id === userData.id);

    if (isMember) {
      socket.join(roomId);
      socket.data.room = roomId;
      //Envia a todos menos al usuario que se une a la sala
      socket.broadcast.to(roomId).emit("user:joined", {
        user: userData,
        roomId,
      });    
      const socketsInRoom = await this.io.in(roomId).fetchSockets();
      const usersInRoom = socketsInRoom.map(sock => sock.data.user) as BoardUser[]
            
      socket.emit("users:list", usersInRoom);  
    } else {
      console.warn(
        `Acceso denegado ${userData.id}, no es miembro del tablero ${roomId}`,
      );
      socket.emit("error:occurred", {
        message: "No eres miembro de este tablero.",
        code: "ACCESS_DENIED",
      });
    }
  }

  private handleLeaveRoom(socket: SocketUser, roomId: string) {
    if (socket.data.user) {
      this.io.to(roomId).emit("user:disconnected", socket.data.user);
      // this.connectedUsers.delete(socket.id);
      socket.leave(roomId);
    }
  }

  private handleDisconnect(socket: SocketUser) {
    if (socket.data.room && socket.data.user) {
      // console.log("Desconectado");
      //Asegura que el usuario estaba en la sala se desconecte
      this.io.to(socket.data.room).emit("user:disconnected", socket.data.user);
    }
    //Eliminar de usuarios conectados
    this.connectedUsers.delete(socket.id);
  }

  //Obtener usuarios en linea
  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }
}
