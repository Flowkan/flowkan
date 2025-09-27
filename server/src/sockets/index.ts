import { Server } from "socket.io";
import UserHandler from "./handlers/user";
import { ServerBoard, ServerUser, SocketBoard, SocketUser } from "./types";

import BoardHandler from "./handlers/board";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import AuthModel from "../models/AuthModel";
import prisma from "../config/db";

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
      next(createHttpError(500, "Autenticación inválida"));
    }
  });

  const userHandler = new UserHandler(io as ServerUser);
  const boardHandler = new BoardHandler(io as ServerBoard);
  io.on("connection", (socket) => {
    userHandler.initialize(socket as SocketUser);
    boardHandler.initialize(socket as SocketBoard);

    console.log("Nuevo cliente conectado:", socket.id);
  });
}
