export type Task = {
	id: string;
	title: string;
	description?: string;
	position: number;
};

export type TaskData = {
	title: string;
	description?: string;
	position: number;
};

export type Column = {
	id: string;
	title: string;
	isVisible: boolean;
	items: Task[];
	position: number;
};

export type ColumnData = {
	title: string;
	isVisible: boolean;
	items: Task[];
	position: number;
};

export type BoardData = {
	title: string;
	columns: {
		[key: string]: Column;
	};
	columnOrder: string[];
};

export type Board = {
	id: string;
	title: string;
};
