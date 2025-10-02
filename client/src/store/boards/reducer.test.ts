import type { DropResult } from "@hello-pangea/dnd";
import { boardsReducer } from "./reducer";
import * as toolsModule from "../../utils/tools";
import type { Board, Column, Task } from "../../pages/boards/types";

describe("boardsReducer", () => {
	// -------------------- BOARDS --------------------
	const mockDropResult: DropResult = {
		draggableId: "task-1",
		type: "TASK",
		reason: "DROP",
		mode: "FLUID",
		combine: null,
		source: {
			droppableId: "col-1",
			index: 0,
		},
		destination: {
			droppableId: "col-2",
			index: 1,
		},
	};

	const boardsDefaultstateBoards = {
		boards: [],
		currentBoard: null,
		loading: false,
		error: null,
	};

	test("should manage boards/update/remote action with no currentBoard", () => {
		const initialState = boardsDefaultstateBoards;

		const result = boardsReducer(initialState, {
			type: "boards/update/remote",
			payload: mockDropResult,
		});

		expect(result).toEqual(initialState);
	});

	test("should manage boards/update/remote action with currentBoard", () => {
		const initialBoard = {
			id: "1",
			slug: "board-slug",
			title: "board 1",
			lists: [],
			members: [],
			image: "image.jpg",
		};
		const initialState = {
			...boardsDefaultstateBoards,
			currentBoard: initialBoard,
		};

		vi.spyOn(toolsModule, "applyDragResult").mockReturnValue({
			...initialBoard,
			title: "board 1 updated",
		});

		const result = boardsReducer(initialState, {
			type: "boards/update/remote",
			payload: mockDropResult,
		});

		expect(toolsModule.applyDragResult).toHaveBeenCalledWith(
			initialBoard,
			mockDropResult,
		);
		expect(result.currentBoard).toEqual({
			...initialBoard,
			title: "board 1 updated",
		});
	});

	test("should manage boards/fetchBoard/pending", () => {
		const result = boardsReducer(boardsDefaultstateBoards, {
			type: "boards/fetchBoard/pending",
		});

		expect(result).toEqual({
			...boardsDefaultstateBoards,
			loading: true,
			error: null,
		});
	});

	test("should manage boards/fetchBoards/fulfilled", () => {
		const boardsPayload: Board[] = [
			{
				id: "1",
				slug: "board-slug",
				title: "board 1",
				lists: [],
				members: [],
				image: "image.jpg",
			},
		];

		const result = boardsReducer(boardsDefaultstateBoards, {
			type: "boards/fetchBoards/fulfilled",
			payload: boardsPayload,
		});

		expect(result).toEqual({
			...boardsDefaultstateBoards,
			loading: false,
			boards: boardsPayload,
		});
	});

	test("should manage boards/fetchBoard/fulfilled", () => {
		const boardPayload: Board = {
			id: "1",
			slug: "board-slug",
			title: "board 1",
			lists: [],
			members: [],
			image: "image.jpg",
		};
		const result = boardsReducer(boardsDefaultstateBoards, {
			type: "boards/fetchBoard/fulfilled",
			payload: boardPayload,
		});

		expect(result).toEqual({
			...boardsDefaultstateBoards,
			loading: false,
			currentBoard: boardPayload,
		});
	});

	test("should manage boards/fetchBoard/rejected", () => {
		const errorPayload = new Error("Something went wrong");
		const result = boardsReducer(boardsDefaultstateBoards, {
			type: "boards/fetchBoard/rejected",
			payload: errorPayload,
		});

		expect(result).toEqual({
			...boardsDefaultstateBoards,
			loading: false,
			error: "Something went wrong",
		});
	});

	test("should manage boards/addBoard/fulfilled", () => {
		const boardPayload: Board = {
			id: "1",
			slug: "board-slug",
			title: "board 1",
			lists: [],
			members: [],
			image: "image.jpg",
		};
		const result = boardsReducer(boardsDefaultstateBoards, {
			type: "boards/addBoard/fulfilled",
			payload: boardPayload,
		});

		expect(result).toEqual({
			...boardsDefaultstateBoards,
			boards: [boardPayload, ...boardsDefaultstateBoards.boards],
		});
	});

	test("should manage boards/deleteBoards", () => {
		const initialState = {
			...boardsDefaultstateBoards,
			boards: [
				{
					id: "1",
					slug: "board-1",
					title: "Board 1",
					lists: [],
					members: [],
					image: "img1.jpg",
				},
				{
					id: "2",
					slug: "board-2",
					title: "Board 2",
					lists: [],
					members: [],
					image: "img2.jpg",
				},
			],
		};
		const result = boardsReducer(initialState, {
			type: "boards/deleteBoards",
			payload: "1",
		});

		expect(result).toEqual({
			...initialState,
			boards: initialState.boards.filter((board) => board.id !== "1"),
		});
	});

	test("should manage boards/editBoard/fulfilled", () => {
		const initialState = {
			...boardsDefaultstateBoards,
			boards: [
				{
					id: "1",
					slug: "board-1",
					title: "Board 1",
					lists: [],
					members: [],
					image: "img1.jpg",
				},
				{
					id: "2",
					slug: "board-2",
					title: "Board 2",
					lists: [],
					members: [],
					image: "img2.jpg",
				},
			],
		};

		const result = boardsReducer(initialState, {
			type: "boards/editBoard/fulfilled",
			payload: {
				boardId: "1",
				data: {
					id: "1",
					slug: "board-1",
					title: "Updated Board",
					lists: [],
					members: [],
					image: "updated.jpg",
				},
			},
		});

		expect(result.boards).toEqual([
			{
				id: "1",
				slug: "board-1",
				title: "Updated Board",
				lists: [],
				members: [],
				image: "updated.jpg",
			},
			{
				id: "2",
				slug: "board-2",
				title: "Board 2",
				lists: [],
				members: [],
				image: "img2.jpg",
			},
		]);
	});

	// -------------------- COLUMNS --------------------
	const boardsDefaultstateColumns = {
		boards: [
			{
				id: "1",
				slug: "board-1",
				title: "Board 1",
				lists: [],
				members: [],
				image: "img1.jpg",
			},
			{
				id: "2",
				slug: "board-2",
				title: "Board 2",
				lists: [],
				members: [],
				image: "img2.jpg",
			},
		],
		currentBoard: {
			id: "1",
			slug: "board-1",
			title: "Board 1",
			lists: [],
			members: [],
			image: "img1.jpg",
		},
		loading: false,
		error: null,
	};

	test("should manage boards/addColumn/fulfilled", () => {
		const columnPayload: Column = {
			id: "1",
			title: "new column",
			isVisible: true,
			cards: [],
			position: 1,
		};
		const initialCurrentBoard = boardsDefaultstateColumns.currentBoard!;
		const result = boardsReducer(boardsDefaultstateColumns, {
			type: "boards/addColumn/fulfilled",
			payload: columnPayload,
		});

		expect(result.currentBoard).toEqual({
			...initialCurrentBoard,
			lists: [...initialCurrentBoard.lists, columnPayload],
		});

		expect(result.boards).toEqual(boardsDefaultstateColumns.boards);
		expect(result.loading).toBe(false);
		expect(result.error).toBeNull();
	});

	test("should manage boards/addCollumn/fulfilled without currentBoard", () => {
		const stateWithNoBoard = {
			...boardsDefaultstateColumns,
			currentBoard: null,
		};
		const columnPayload: Column = {
			id: "1",
			title: "new column",
			isVisible: true,
			cards: [],
			position: 1,
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/addColumn/fulfilled",
			payload: columnPayload,
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage boards/editColumn/fulfilled", () => {
		const initialState = {
			...boardsDefaultstateColumns,
			currentBoard: {
				...boardsDefaultstateColumns.currentBoard,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						cards: [],
						position: 1,
					},
					{
						id: "2",
						title: "Column 2",
						isVisible: true,
						cards: [],
						position: 2,
					},
				],
			},
		};
		const updatedColumn = {
			id: "1",
			title: "updated column",
			isVisible: true,
			cards: [],
			position: 1,
		};
		const result = boardsReducer(initialState, {
			type: "boards/editColumn/fulfilled",
			payload: { columnId: 1, column: updatedColumn },
		});

		expect(result.currentBoard?.lists).toEqual([
			{
				id: "1",
				title: "updated column",
				isVisible: true,
				cards: [],
				position: 1,
			},
			{
				id: "2",
				title: "Column 2",
				isVisible: true,
				cards: [],
				position: 2,
			},
		]);
	});

	test("should manage boards/editColumn/fulfilled without currentBoard", () => {
		const stateWithNoBoard = {
			...boardsDefaultstateColumns,
			currentBoard: null,
		};
		const updatedColumn = {
			id: "1",
			title: "updated column",
			isVisible: true,
			cards: [],
			position: 1,
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/editColumn/fulfilled",
			payload: { columnId: 1, column: updatedColumn },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage boards/deleteColumn/fulfilled", () => {
		const initialState = {
			...boardsDefaultstateColumns,
			currentBoard: {
				id: "1",
				slug: "board-1",
				title: "Board 1",
				members: [],
				image: "img1.jpg",
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						cards: [],
						position: 1,
					},
					{
						id: "2",
						title: "Column 2",
						isVisible: true,
						cards: [],
						position: 2,
					},
				],
			},
		};
		const result = boardsReducer(initialState, {
			type: "boards/deleteColumn/fulfilled",
			payload: { columnId: "1" },
		});

		expect(result.currentBoard?.lists).toEqual([
			{
				id: "2",
				title: "Column 2",
				isVisible: true,
				cards: [],
				position: 2,
			},
		]);
	});

	test("should manage boards/deleteColumn/fulfilled without currentBoard", () => {
		const stateWithNoBoard = {
			...boardsDefaultstateColumns,
			currentBoard: null,
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/deleteColumn/fulfilled",
			payload: { columnId: "1" },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	// -------------------- TASKS --------------------
	const boardsDefaultstateTasks = {
		boards: [
			{
				id: "1",
				slug: "board-1",
				title: "Board 1",
				lists: [],
				members: [],
				image: "img1.jpg",
			},
			{
				id: "2",
				slug: "board-2",
				title: "Board 2",
				lists: [],
				members: [],
				image: "img2.jpg",
			},
		],
		currentBoard: {
			id: "1",
			slug: "board-1",
			title: "Board 1",
			lists: [
				{
					id: "1",
					title: "Column 1",
					isVisible: true,
					cards: [],
					position: 1,
				},
			],
			members: [],
			image: "img1.jpg",
		},
		loading: false,
		error: null,
	};

	test("should manage boards/addTask/fulfilled", () => {
		const taskPayload: Task = {
			id: 101,
			title: "New Task",
			listId: 1,
			description: "Task description",
			position: 1,
			assignees: [],
		};
		const initialState = { ...boardsDefaultstateTasks };
		const result = boardsReducer(initialState, {
			type: "boards/addTask/fulfilled",
			payload: { columnId: 1, task: taskPayload },
		});

		expect(result.currentBoard?.lists).toEqual([
			{
				id: "1",
				title: "Column 1",
				isVisible: true,
				position: 1,
				cards: [taskPayload],
			},
		]);
	});

	test("should manage boards/addTask/fulfilled without currentBoard", () => {
		const stateWithNoBoard = { ...boardsDefaultstateTasks, currentBoard: null };
		const taskPayload: Task = {
			id: 101,
			title: "New Task",
			listId: 1,
			description: "Task description",
			position: 1,
			assignees: [],
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/addTask/fulfilled",
			payload: { columnId: 1, task: taskPayload },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage boards/addTask/fulfilled without currentBoard", () => {
		const stateWithNoBoard = { ...boardsDefaultstateTasks, currentBoard: null };
		const taskPayload: Task = {
			id: 101,
			title: "New Task",
			listId: 1,
			description: "Task description",
			position: 1,
			assignees: [],
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/addTask/fulfilled",
			payload: { columnId: 1, task: taskPayload },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage boards/editTask/fulfilled", () => {
		const initialState = {
			...boardsDefaultstateTasks,
			currentBoard: {
				...boardsDefaultstateTasks.currentBoard,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						position: 1,
						cards: [
							{ id: 1, title: "Task 1", listId: 1, position: 1, assignees: [] },
							{ id: 2, title: "Task 2", listId: 1, position: 2, assignees: [] },
						],
					},
				],
			},
		};
		const updatedTask: Task = {
			id: 1,
			title: "Task 1 updated",
			listId: 1,
			position: 1,
			assignees: [],
		};
		const result = boardsReducer(initialState, {
			type: "boards/editTask/fulfilled",
			payload: { columnId: 1, task: updatedTask },
		});

		expect(result.currentBoard?.lists[0].cards).toEqual([
			{
				id: 1,
				title: "Task 1 updated",
				listId: 1,
				position: 1,
				assignees: [],
			},
			{ id: 2, title: "Task 2", listId: 1, position: 2, assignees: [] },
		]);
	});

	test("should manage boards/editTask/fulfilled when moving a task to a different column", () => {
		const initialState = {
			...boardsDefaultstateTasks,
			currentBoard: {
				...boardsDefaultstateTasks.currentBoard!,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						position: 1,
						cards: [
							{ id: 1, title: "Task 1", listId: 1, position: 1, assignees: [] },
						],
					},
					{
						id: "2",
						title: "Column 2",
						isVisible: true,
						position: 2,
						cards: [],
					},
				],
			},
		};
		const movedTask: Task = {
			id: 1,
			title: "Task 1 moved",
			listId: 2,
			position: 1,
			assignees: [],
		};
		const result = boardsReducer(initialState, {
			type: "boards/editTask/fulfilled",
			payload: { columnId: 2, task: movedTask },
		});

		// column 1 should be empty
		expect(result.currentBoard?.lists[0].cards).toEqual([]);
		//column 2 should have a task
		expect(result.currentBoard?.lists[1].cards).toEqual([
			{ id: 1, title: "Task 1 moved", listId: 2, position: 1, assignees: [] },
		]);
	});

	test("should manage boards/editTask/fulfilled without currentBoard", () => {
		const stateWithNoBoard = { ...boardsDefaultstateTasks, currentBoard: null };
		const updatedTask: Task = {
			id: 1,
			title: "Task 1 updated",
			listId: 1,
			position: 1,
			assignees: [],
		};
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/editTask/fulfilled",
			payload: { columnId: 1, task: updatedTask },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage boards/deleteTask/fulfilled", () => {
		const initialState = {
			...boardsDefaultstateTasks,
			currentBoard: {
				...boardsDefaultstateTasks.currentBoard!,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						position: 1,
						cards: [
							{ id: 1, title: "Task 1", listId: 1, position: 1, assignees: [] },
							{ id: 2, title: "Task 2", listId: 1, position: 2, assignees: [] },
						],
					},
				],
			},
		};

		const result = boardsReducer(initialState, {
			type: "boards/deleteTask/fulfilled",
			payload: { columnId: "1", taskId: "1" },
		});

		expect(result.currentBoard?.lists[0].cards).toEqual([
			{ id: 2, title: "Task 2", listId: 1, position: 2, assignees: [] },
		]);
	});

	test("should manage boards/deleteTask/fulfilled when columnId does not matches", () => {
		const initialState = {
			...boardsDefaultstateTasks,
			currentBoard: {
				...boardsDefaultstateTasks.currentBoard!,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						position: 1,
						cards: [
							{ id: 1, title: "Task 1", listId: 1, position: 1, assignees: [] },
						],
					},
				],
			},
		};

		const result = boardsReducer(initialState, {
			type: "boards/deleteTask/fulfilled",
			payload: { columnId: "2", taskId: "1" },
		});

		expect(result).toEqual(initialState);
	});

	test("should manage boards/deleteTask/fulfilled without currentBoard", () => {
		const stateWithNoBoard = { ...boardsDefaultstateTasks, currentBoard: null };
		const result = boardsReducer(stateWithNoBoard, {
			type: "boards/deleteTask/fulfilled",
			payload: { columnId: "1", taskId: "1" },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	// -------------------- ASSIGNEE --------------------
	const boardsDefaultstateCards = {
		boards: [],
		currentBoard: {
			id: "1",
			slug: "board-1",
			title: "Board 1",
			image: "img1.jpg",
			members: [],
			lists: [
				{
					id: "1",
					title: "Column 1",
					isVisible: true,
					position: 1,
					cards: [
						{
							id: 1,
							title: "Task 1",
							listId: 1,
							description: "description",
							position: 1,
							assignees: [],
							media: [],
						},
					],
				},
			],
		},
		loading: false,
		error: null,
	};

	test("should manage cards/addAssignee/fulfilled when adding assignee to correct task", () => {
		const userPayload = {
			id: 1,
			name: "user",
			email: "user@email.com",
			photo: "user.jpg",
		};
		const result = boardsReducer(boardsDefaultstateCards, {
			type: "cards/addAssignee/fulfilled",
			payload: { cardId: 1, user: userPayload },
		});

		expect(result.currentBoard?.lists[0].cards[0].assignees).toEqual([
			{
				cardId: 1,
				userId: 1,
				user: {
					id: 1,
					name: "user",
					email: "user@email.com",
					photo: "user.jpg",
				},
			},
		]);
	});

	test("should manage cards/addAssignee/fulfilled when cardId does not match", () => {
		const userPayload = {
			id: 1,
			name: "user",
			email: "user@email.com",
			photo: "user.jpg",
		};
		const result = boardsReducer(boardsDefaultstateCards, {
			type: "cards/addAssignee/fulfilled",
			payload: { cardId: 999, user: userPayload },
		});

		expect(result).toEqual(boardsDefaultstateCards);
	});

	test("should manage cards/addAssignee/fulfilled without currentBoard", () => {
		const userPayload = {
			id: 1,
			name: "user",
			email: "user@email.com",
			photo: "user.jpg",
		};
		const stateWithNoBoard = { ...boardsDefaultstateCards, currentBoard: null };
		const result = boardsReducer(stateWithNoBoard, {
			type: "cards/addAssignee/fulfilled",
			payload: { cardId: 1, user: userPayload },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	test("should manage cards/removeAssignee/fulfilled when assignee exists", () => {
		const initialState = {
			...boardsDefaultstateCards,
			currentBoard: {
				...boardsDefaultstateCards.currentBoard!,
				lists: [
					{
						id: "1",
						title: "Column 1",
						isVisible: true,
						position: 1,
						cards: [
							{
								id: 1,
								title: "Task 1",
								listId: 1,
								description: "description",
								position: 1,
								assignees: [
									{
										cardId: 1,
										userId: 1,
										user: {
											id: 1,
											name: "user",
											email: "user@email.com",
											photo: "user.jpg",
										},
									},
								],
								media: [],
							},
						],
					},
				],
			},
		};
		const result = boardsReducer(initialState, {
			type: "cards/removeAssignee/fulfilled",
			payload: { cardId: 1, userId: 1 },
		});

		expect(result.currentBoard?.lists[0].cards[0].assignees).toEqual([]);
	});

	test("should manage cards/removeAssignee/fulfilled when cardId does not match", () => {
		const result = boardsReducer(boardsDefaultstateCards, {
			type: "cards/removeAssignee/fulfilled",
			payload: { cardId: 999, userId: 1 }, // task que no existe
		});

		expect(result).toEqual(boardsDefaultstateCards);
	});

	test("should manage cards/removeAssignee/fulfilled without currentBoard", () => {
		const stateWithNoBoard = { ...boardsDefaultstateCards, currentBoard: null };
		const result = boardsReducer(stateWithNoBoard, {
			type: "cards/removeAssignee/fulfilled",
			payload: { cardId: 1, userId: 1 },
		});

		expect(result).toEqual(stateWithNoBoard);
	});

	// -------------------- DEFAULT --------------------
	test("should return the initial state for unknown action", () => {
		const unknownAction = { type: "unknown/action" } as any;
		const result = boardsReducer(boardsDefaultstateBoards, unknownAction);

		expect(result).toEqual(boardsDefaultstateBoards);
	});
});
