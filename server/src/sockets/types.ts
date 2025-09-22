import { Board } from "@prisma/client";
import { Server, Socket } from "socket.io";
import { BoardWithRelations } from "../models/BoardModel";

export interface BoardUser {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
}
export interface SocketError {
  code: string; // Código del error, ej. 'INVALID_MESSAGE'
  message: string; // Descripción legible del error
}

export interface Task {
  id?: number | undefined;
  title: string;
  listId: number;
  description?: string | undefined;
  position: number;
}

export interface DragStart{
   draggableId: string,
   type: string,
   source: { droppableId: string, index: number },
   mode: string;
}

// Eventos que el servidor enviará al cliente
export interface ServerToClientEvents {
  "user:connected": (usersOnline: BoardUser) => void;
  "user:disconnected": (usersOnline: BoardUser) => void;
  "user:joined": (data: { user: BoardUser; roomId: string }) => void;
  "users:list": (users: BoardUser[]) => void;
  "error:occurred": (error: SocketError) => void;

  // --- Board events ---
  // "board:dragstart": (payload:{
  //   start:unknown,
  //   board:BoardWithRelations,
  //   task:Task,
  //   userId:string
  // })=>void;
  "board:dragstarted": (payload:{
    start:unknown,
    board:BoardWithRelations,
    userId:string,
    name:string,
    task:Task,
    x:number,y:number
  })=>void;
  "board:dragshowcoords":(payload:{    
    x:number,
    y:number
  })=>void;
  "board:dragupdated":(payload:{
    update:unknown,    
  })=>void;
   "board:dragend":(payload:{
    result:unknown,    
  })=>void;
  //Errors
  "board:dragfailed":(payload:{draggableId:string})=>void;
}

export interface ClientToServerEvents {
  "user:update": (user: BoardUser) => void;
  "join:room": (roomId: string) => void;
  "request:users": () => void; 

  // --- Board events ---
  "board:dragstart": (payload:{
    start:unknown,
    board:BoardWithRelations,
    task:Task,
    x:number,
    y:number
  })=>void;
  "board:dragsendcoords":(payload:{    
    x:number,
    y:number
  })=>void;
  "board:dragupdate":(payload:{
    update:unknown,    
  })=>void;
  "board:dragupdated":(payload:{
    update:unknown,    
  })=>void;
  "board:dragend":(payload:{
    result:unknown,    
  })=>void;  
  //Errors
  "board:dragfailed":(payload:{draggableId:string})=>void;
}

type UserData = {
  user?: BoardUser;
  room?: string;
}

type BoardData = {
  board:BoardWithRelations;
}

export type SocketData = UserData & BoardData

interface AuthPayload {
  // userId: string;
  user: BoardUser;
  boardId: string;
  // Puedes agregar más campos si lo necesitas
}

export type SocketUser = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
> & {
  handshake: Socket["handshake"] & {
    auth: AuthPayload;
  };
};

export type ServerUser = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;


export type SocketBoard = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

export type ServerBoard = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;;
