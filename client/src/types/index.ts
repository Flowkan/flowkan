export interface Task {
  id: string;
  content: string;
}

export interface Column {
  id: string;
  title: string;
  items: Task[];
}

export interface BoardData {
  columns: Record<string, Column>;
  columnOrder: string[];
}
