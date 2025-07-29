export type Task = {
	id: string;
	content: string;
	description?: string;
};

export type Column = {
	id: string;
	title: string;
	items: Task[];
};

export type BoardData = {
	columns: {
		[key: string]: Column;
	};
	columnOrder: string[];
};
