import type { User } from "../login/types";

export interface BoardsData {
	title: string;
}

export type CardAssignee = {
	cardId: number;
	userId: number;
	user: User;
};

export type Task = {
	id?: number;
	title: string;
	listId: number;
	description?: string;
	position: number;
	assignees: CardAssignee[];
};

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
};

export type BoardMember = {
	userId: number;
	role: string;
	user: User;
};
