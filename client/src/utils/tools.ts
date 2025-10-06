import type { DraggableLocation, DropResult } from "@hello-pangea/dnd";
import type { Board, Task } from "../pages/boards/types";

export const formatDate = (dateString: string) => {
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	if (dateString === "") {
		return new Date().toLocaleDateString("es-ES", options);
	}
	return new Date(dateString).toLocaleDateString("es-ES", options);
};

const reorder = <T>(list: T[], startIndex: number, endIndex: number): T[] => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};

const move = <T>(
	source: T[],
	destination: T[],
	droppableSource: DraggableLocation,
	droppableDestination: DraggableLocation,
): { [key: string]: T[] } => {
	const sourceClone = Array.from(source);
	const destClone = Array.from(destination);
	const [removed] = sourceClone.splice(droppableSource.index, 1);

	destClone.splice(droppableDestination.index, 0, removed);

	const result: { [key: string]: T[] } = {};
	result[droppableSource.droppableId] = sourceClone;
	result[droppableDestination.droppableId] = destClone;

	return result;
};

export const applyDragResult = (
	boardData: Board,
	result: DropResult,
): Board => {
	const { type, source, destination } = result;

	// Si no hay destino, devuelve el estado sin cambios
	if (!destination) {
		return boardData;
	}

	let newBoardData = { ...boardData };

	if (type === "column") {
		const reorderedLists = reorder(
			boardData.lists,
			source.index,
			destination.index,
		);
		newBoardData = { ...newBoardData, lists: reorderedLists };
	} else {
		const sInd = source.droppableId;
		const dInd = destination.droppableId;

		const sourceColIndex = boardData.lists.findIndex(
			(c) => c.id?.toString() === sInd,
		);
		const destColIndex = boardData.lists.findIndex(
			(c) => c.id?.toString() === dInd,
		);

		if (sourceColIndex === -1 || destColIndex === -1) return boardData;

		const sourceCol = boardData.lists[sourceColIndex];
		const destCol = boardData.lists[destColIndex];

		let newSourceCards: Task[];
		let newDestCards: Task[];

		if (sInd === dInd) {
			newSourceCards = reorder(
				sourceCol.cards,
				source.index,
				destination.index,
			);
			newDestCards = newSourceCards;
		} else {
			const moveResult = move(
				sourceCol.cards,
				destCol.cards,
				source,
				destination,
			);
			// La función move debe devolver un objeto con las dos listas actualizadas
			// Asumo que devuelve algo como: { [source.droppableId]: [...], [destination.droppableId]: [...] }
			newSourceCards = moveResult[sInd];
			newDestCards = moveResult[dInd];
		}

		const newLists = [...boardData.lists];
		newLists[sourceColIndex] = { ...sourceCol, cards: newSourceCards };
		newLists[destColIndex] = { ...destCol, cards: newDestCards };

		newBoardData = { ...newBoardData, lists: newLists };
	}

	return newBoardData;
};

export const truncateWordTitle = (title: string, maxLength?: number) => {
	const MAX_LENGTH = maxLength ?? 40;
	if (!title) return "";
	if (title.length <= MAX_LENGTH) return title;
	const truncated = title.slice(0, MAX_LENGTH);
	const wordSpace = truncated.lastIndexOf(" ");
	if (wordSpace > 0) {
		return truncated.slice(0, wordSpace) + "...";
	}
	return truncated + "...";
};
