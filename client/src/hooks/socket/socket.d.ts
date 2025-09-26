// import type { DragStart } from "@hello-pangea/dnd";

import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import type { Task } from "../../pages/boards/types";

type TaskClean = Omit<Task, "assignees">;

export interface SocketError {
	code: string;
	message: string;
}

// Eventos que el servidor enviará al cliente
export interface ServerToClientEvents {
	"user:connected": (usersOnline: BoardUser) => void;
	"user:disconnected": (usersOnline: BoardUser) => void;
	"user:joined": (data: { user: BoardUser; roomId: string }) => void;
	"users:list": (users: BoardUser[]) => void;
	"error:occurred": (error: SocketError) => void;

	"board:dragstarted": (payload: {
		start: DragStart;
		board: BoardWithRelations;
		userId: string;
		name: string;
		task: TaskClean;
		x: number;
		y: number;
	}) => void;
	"board:dragshowcoords": (payload: {
		// update:unknown,
		x: number;
		y: number;
	}) => void;
	"board:dragupdated": (payload: { update: DragUpdate }) => void;
	"board:dragend": (payload: { result: DropResult }) => void;
	//Errors
	"board:dragfailed": (payload: { draggableId: string }) => void;
}

export interface ClientToServerEvents {
	"user:update": (user: BoardUser) => void;
	"join:room": (roomId: string) => void;
	"request:users": () => void;
	"error:occurred": (error: SocketError) => void;

	// --- Board events ---
	"board:dragstart": (payload: {
		start: DragStart;
		task: TaskClean;
		x: number;
		y: number;
	}) => void;
	"board:dragsendcoords": (payload: {
		// update:unknown,
		x: number;
		y: number;
	}) => void;
	"board:dragupdate": (payload: { update: DragUpdate }) => void;
	"board:dragupdated": (payload: { update: DragUpdate }) => void;

	"board:dragend": (payload: { result: DropResult }) => void;
}
