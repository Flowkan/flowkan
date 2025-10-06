import { Server } from "socket.io";
import UserHandler from "./handlers/user";
import ChatHandler from "./handlers/chat";
import {
  ServerBoard,
  ServerChat,
  ServerUser,
  SocketBoard,
  SocketChat,
  SocketUser,
} from "./types";

import BoardHandler from "./handlers/board";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import AuthModel from "../models/AuthModel";
import prisma from "../config/db";
import SystemEmitterHandler from "./handlers/systemEmitter";
import NotificationThumbnailHandler from "./handlers/notificationThumbnail";

export interface JwtPayload {
  userId: number;
}

export default function registerSockets(io: Server) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(
          createHttpError(500, "Token de autenticación no proporcionado"),
        );
      }
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const payload = jwt.verify(token, JWT_SECRET);
      let data: JwtPayload;
      if (typeof payload === "string") {
        try {
          data = JSON.parse(payload);
        } catch {
          return next(createHttpError(401, "Invalid token payload"));
        }
      } else if (
        typeof payload === "object" &&
        payload !== null &&
        "userId" in payload
      ) {
        data = payload as JwtPayload;
      } else {
        return next(createHttpError(401, "Invalid token payload"));
      }
      const user = await new AuthService(new AuthModel(prisma)).findById(
        data.userId,
      );
      if (!user) {
        return next(createHttpError(404, "Usuario no encontrado"));
      }
      socket.data.user = user;
      next();
    } catch (error) {
      next(createHttpError(500, `${error}`));
    }
  });

  const userHandler = new UserHandler(io as ServerUser);
  const boardHandler = new BoardHandler(io as ServerBoard);
  const chatHandler = new ChatHandler(io as ServerChat);

  const notificationThumbnailHandler = new NotificationThumbnailHandler(
    io as ServerUser,
  );  
  io.on("connection", (socket) => {
    userHandler.initialize(socket as SocketUser);
    boardHandler.initialize(socket as SocketBoard);
    chatHandler.initialize(socket as SocketChat);

    notificationThumbnailHandler.initialize(socket as SocketUser);
  });

  const workerNameSpace = io.of("/worker");
  workerNameSpace.use(async(socket,next)=>{
    try {
      const token = socket.handshake.auth.token
      if(token === process.env.SOCKET_WORKER_SECRET_KEY){
        console.log("[Worker] Autenticado  y listo.");
        const userId = socket.handshake.auth.userId
        socket.data.userId = userId
        return next()
      }
    } catch (error) {
      next(createHttpError(500,`${error}`))
    }
  })
  // systemHandler
  const systemHandler = new SystemEmitterHandler()
  workerNameSpace.on("connection",(socket)=>{
    systemHandler.initialize(socket as SocketUser)
  })
}
