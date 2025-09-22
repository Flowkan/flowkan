// import type { DragStart } from "@hello-pangea/dnd";

import type { Board } from "../../pages/boards/types";

// Define los eventos que el servidor enviará al cliente
export interface ServerToClientEvents {
	"user:connected": (usersOnline: BoardUser) => void;
	"user:disconnected": (usersOnline: BoardUser) => void;
	"user:joined": (data: { user: BoardUser; roomId: string }) => void;
	"users:list": (users: BoardUser[]) => void;
	"error:occurred": (error: SocketError) => void;

	// --- Board events ---
	"board:dragstart": (payload: {
		start: unknown;
		board: Board;
		userId: string;
	}) => void;
	"board:dragstarted": (payload: {
		start: unknown;
		board: BoardWithRelations;
		userId: string;
    x:number;
    y:number;
	}) => void;
  "board:dragshowcoords":(payload:{
    // update:unknown,
    x:number,
    y:number
  })=>void;
  "board:dragupdated":(payload:{
    update:unknown,    
  })=>void;
}

export interface ClientToServerEvents {
	"user:update": (user: BoardUser) => void;
	"join:room": (roomId: string) => void;
	"request:users": () => void;

	// --- Board events ---
	"board:dragstart": (payload: {
		start: unknown;
		board: Board;
		x: number;
		y: number;
	}) => void;
  "board:dragsendcoords":(payload:{
    // update:unknown,
    x:number,
    y:number
  })=>void;
  "board:dragupdate":(payload:{
    update:unknown,    
  })=>void;
  "board:dragupdated":(payload:{
    update:unknown,    
  })=>void;
}
