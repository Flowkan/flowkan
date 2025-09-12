export interface BoardsData {
	title: string;
}

export type Task = {
	id?: number;
	title: string;
	listId: number;
	description?: string;
	position: number;
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
	title: string;
	lists: Column[];
};
