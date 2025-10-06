// import type { DragStart } from "@hello-pangea/dnd";

import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import type { Task } from "../../pages/boards/types";
import type { User } from "../../pages/login/types";

type TaskClean = Omit<Task, "assignees">;

type BoardUser = User;

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

	// Chat
	"board:chatMessage": (msg: ChatMessage) => void;
	"chat:history": (msgs: ChatMessage[]) => void;

	// --- Notification ---
	"user:thumbnailLoading": (data: { userId: number; originalPath: string }) => void;
	"user:thumbnailCompleted": (data: {
		userId: number;
		originalPath: string;
		thumbPath: string;
	}) => void;
	"user:thumbnailError": () => void;
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
	"board:dragsendcoords": (payload: {
		// update:unknown,
		x: number;
		y: number;
	}) => void;
	"board:dragupdate": (payload: { update: DragUpdate }) => void;
	"board:dragupdated": (payload: { update: DragUpdate }) => void;

	"board:dragend": (payload: { result: DropResult }) => void;

	// --- Chat events ---
	"board:joinChat": (payload: { boardId: string; userId: number }) => void;
	"board:leaveChat": (payload: { boardId: string; userId: number }) => void;
	"board:chatMessage": (payload: {
		boardId: string;
		message: ChatMessage;
	}) => void;
}
