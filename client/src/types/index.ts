export interface Task {
	id: string;
	content: string;
	description?: string;
}

export interface Column {
	id: string;
	title: string;
	items: Task[];
	isVisible: boolean;
}

export interface BoardData {
	columns: Record<string, Column>;
	columnOrder: string[];
}
