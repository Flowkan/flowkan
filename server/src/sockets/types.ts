import { Server, Socket } from "socket.io";
import { BoardWithRelations } from "../models/BoardModel";

export interface BoardUser {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
}
export interface SocketError {
  code: string;
  message: string;
}

export interface Task {
  id: number | undefined;
  title: string;
  listId: number;
  description: string | undefined;
  position: number;
}

type TaskClean = Omit<Task, "assignees">;

export interface DragStart {
  draggableId: string;
  type: string;
  source: { droppableId: string; index: number };
  mode: string;
}

export interface DragUpdate {
  draggableId: string;
  type: string;
  source: { droppableId: string; index: number };
  destination?: { droppableId: string; index: number };
  mode: string;
}

export interface DropResult {
  draggableId: string;
  type: string;
  source: { droppableId: string; index: number };
  destination: { droppableId: string; index: number } | null;
  reason: "DROP" | "CANCEL";
}

// --- Chat ---
export interface ChatMessage {
  senderId: number;
  text: string;
  timestamp: string;
  senderAvatar?: string | null;
  senderName?: string | null;
}

// Eventos que el servidor enviará al cliente
export interface ServerToClientEvents {
  "user:connected": (usersOnline: BoardUser) => void;
  "user:disconnected": (usersOnline: BoardUser) => void;
  "user:joined": (data: { user: BoardUser; roomId: string }) => void;
  "users:list": (users: BoardUser[]) => void;
  "error:occurred": (error: SocketError) => void;

  // --- Board events ---
  "board:dragstarted": (payload: {
    start: DragStart;
    board: BoardWithRelations;
    userId: string;
    name: string;
    task: TaskClean;
    x: number;
    y: number;
  }) => void;
  "board:dragshowcoords": (payload: { x: number; y: number }) => void;
  "board:dragupdated": (payload: { update: DragUpdate }) => void;
  "board:dragend": (payload: { result: DropResult }) => void;
  "board:dragfailed": (payload: { draggableId: string }) => void;

  // --- Chat events ---
  "board:chatMessage": (msg: ChatMessage) => void;
  "chat:history": (msgs: ChatMessage[]) => void;
}

export interface ClientToServerEvents {
  "user:update": (user: BoardUser) => void;
  "join:room": (roomId: string) => void;
  "leave:room": (roomId: string) => void;
  "request:users": () => void;
  "error:occurred": (error: SocketError) => void;

  // --- Board events ---
  "board:dragstart": (payload: {
    start: DragStart;
    task: TaskClean;
    x: number;
    y: number;
  }) => void;
  "board:dragsendcoords": (payload: { x: number; y: number }) => void;
  "board:dragupdate": (payload: { update: DragUpdate }) => void;
  "board:dragupdated": (payload: { update: DragUpdate }) => void;
  "board:dragend": (payload: { result: DropResult }) => void;
  "board:dragfailed": (payload: { draggableId: string }) => void;

  // --- Chat events ---
  "board:joinChat": (payload: { boardId: string; userId: number }) => void;
  "board:leaveChat": (payload: { boardId: string; userId: number }) => void;
  "board:chatMessage": (payload: {
    boardId: string;
    message: ChatMessage;
  }) => void;
}

type UserData = {
  user?: BoardUser;
  room?: string;
};

type BoardData = {
  board: BoardWithRelations;
};

export type SocketData = UserData & BoardData;

export interface AuthPayload {
  boardId: string;
  token: string;
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

export type SocketChat = Socket<
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
>;

export type ServerChat = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;
