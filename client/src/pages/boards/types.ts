import type { User } from "../login/types";

export interface BoardsData {
	title: string;
	image: File;
}

export interface EditBoardsData {
	title?: string;
	image?: File;
}

export type CardAssignee = {
	cardId: number;
	userId: number;
	user: User;
};

export type Media = {
	id: number;
	url: string;
	fileName: string;
	fileType: "document" | "audio";
};

export type Task = {
	id?: number;
	title: string;
	listId: number;
	description?: string;
	position: number;
	assignees: CardAssignee[];
	media?: Media[];
};

export interface TaskWithMedia extends Task {
	media?: Media[];
}

export type Column = {
	id?: string;
	title: string;
	isVisible: boolean;
	cards: Task[];
	position: number;
};

export type Board = {
	id: string;
	slug: string;
	title: string;
	lists: Column[];
	members: BoardMember[];
	image: string;
};

export type BoardMember = {
	userId: number;
	role: string;
	user: User;
};
