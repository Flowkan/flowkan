/**
 * @vitest-environment happy-dom
 */
import {
	getBoard,
	createBoard,
	updateBoard,
	deleteBoard,
	getBoards,
	createColumn,
	updateColumn,
	deleteColumn,
	createTask,
	updateTask,
	deleteTask,
	createInvitationLink,
	acceptInvitation,
	getBoardUsers,
	addAssignee,
	removeAssignee,
} from "./service";
import {
	BOARD_ENDPOINTS,
	CARD_ENDPOINT,
	LIST_ENDPOINT,
} from "../../utils/endpoints";
import type { User } from "../login/types";
import type { Board, Column, Task } from "./types";
import { apiClient } from "../../api/client";

vi.mock("../../api/client", () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		delete: vi.fn(),
	},
}));

beforeEach(() => {
	vi.clearAllMocks();
});

describe("getBoards", () => {
	test("should return all boards successfully", async () => {
		const mockBoards: Board[] = [
			{
				id: "1",
				slug: "slug-1",
				title: "Board 1",
				lists: [],
				members: [],
				image: "",
			},
			{
				id: "2",
				slug: "slug-2",
				title: "Board 2",
				lists: [],
				members: [],
				image: "",
			},
		] as Board[];

		(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockBoards,
		});

		const result = await getBoards(2, 3);

		expect(result).toEqual(mockBoards);
		expect(apiClient.get).toHaveBeenCalledWith(BOARD_ENDPOINTS.BOARDS, {
			params: { page: 2, limit: 3, withCount: true },
		});
	});

	test("should throw an error if API fails", async () => {
		(apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(getBoards(10, 0)).rejects.toThrow("Network error");
	});
});

describe("createBoard", () => {
	test("should return a new board successfully", async () => {
		const mockNewBoard: Board = {
			id: "1",
			slug: "slug-1",
			title: "Board 1",
			lists: [],
			members: [],
			image: "",
		} as Board;

		(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockNewBoard,
		});

		const formData = new FormData();
		formData.append("title", "Board 1");
		formData.append("image", "fake.png");

		const result = await createBoard(formData);

		expect(result).toEqual(mockNewBoard);
		expect(apiClient.post).toHaveBeenCalledWith(
			BOARD_ENDPOINTS.BOARDS,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const formData = new FormData();
		formData.append("title", "Board 1");

		await expect(createBoard(formData)).rejects.toThrow("Network error");
	});
});

describe("updateBoard", () => {
	test("should return an updated board successfully", async () => {
		const mockUpdatedBoard: Board = {
			id: "1",
			slug: "slug-1",
			title: "Board 1",
			lists: [],
			members: [],
			image: "",
		} as Board;

		(apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockUpdatedBoard,
		});

		const formData = new FormData();
		formData.append("title", "Board 1");

		const result = await updateBoard("1", formData);

		expect(result).toEqual(mockUpdatedBoard);
		expect(apiClient.put).toHaveBeenCalledWith(
			`${BOARD_ENDPOINTS.BOARDS}/1`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } },
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.put as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const formData = new FormData();
		formData.append("title", "Board 1");

		expect(updateBoard("1", formData)).rejects.toThrow("Network error");
	});
});

describe("deleteBoard", () => {
	test("should delete a given board successfully", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

		await deleteBoard("1");

		expect(apiClient.delete).toHaveBeenCalledWith(
			`${BOARD_ENDPOINTS.BOARDS}/1`,
		);
	});

	test("should throw an error if the API request fails", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(deleteBoard("1")).rejects.toThrow("Network error");
	});
});

describe("getBoard", () => {
	test("should return a board by ID successfully", async () => {
		const mockBoard: Board = {
			id: "1",
			slug: "slug-1",
			title: "Board 1",
			lists: [],
			members: [],
			image: "",
		} as Board;

		(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockBoard,
		});

		const result = await getBoard("1");

		expect(result).toEqual(mockBoard);
		expect(apiClient.get).toHaveBeenCalledWith(BOARD_ENDPOINTS.BY_ID("1"));
	});

	test("should throw an error if API request fails", async () => {
		(apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(getBoard("1")).rejects.toThrow("Network error");
	});
});

describe("createColumn", () => {
	test("should return a new column successfully", async () => {
		const mockNewColumn: Column = {
			id: "1",
			title: "New column",
			isVisible: true,
			cards: [],
			position: 1,
		} as Column;

		(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockNewColumn,
		});

		const result = await createColumn("1", mockNewColumn);

		expect(result).toEqual(mockNewColumn);
		expect(apiClient.post).toHaveBeenCalledWith(LIST_ENDPOINT.LISTS, {
			...mockNewColumn,
			boardId: "1",
		});
	});

	test("should throw an error when API request fails", async () => {
		const mockNewColumn: Column = {
			id: "1",
			title: "New column",
			isVisible: true,
			cards: [],
			position: 1,
		} as Column;

		(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(createColumn("1", mockNewColumn)).rejects.toThrow(
			"Network error",
		);
	});
});

describe("updateColumn", () => {
	test("should return an updated column successfully", async () => {
		const mockUpdatedColumn: Column = {
			id: "1",
			title: "Updated column",
			isVisible: true,
			cards: [],
			position: 1,
		} as Column;

		(apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockUpdatedColumn,
		});

		const updateData: Partial<Column> = { title: "Updated column" };

		const result = await updateColumn("1", updateData);

		expect(result).toEqual(mockUpdatedColumn);
		expect(apiClient.put).toHaveBeenCalledWith(
			LIST_ENDPOINT.BY_ID("1"),
			updateData,
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.put as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const updateData: Partial<Column> = { title: "Updated column" };

		await expect(updateColumn("1", updateData)).rejects.toThrow(
			"Network error",
		);
	});
});

describe("deleteColumn", () => {
	test("should delete a column successfully", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

		await deleteColumn("1");

		expect(apiClient.delete).toHaveBeenCalledWith(LIST_ENDPOINT.BY_ID("1"));
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(deleteColumn("1")).rejects.toThrow("Network error");
	});
});

describe("createTask", () => {
	test("should return a new task successfully", async () => {
		const mockNewTask: Task = {
			id: 1,
			title: "new task",
			listId: 1,
			description: "",
			position: 1,
			assignees: [],
		} as Task;

		(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockNewTask,
		});

		const newData: Partial<Task> = { title: "new task" };

		const result = await createTask(1, newData);

		expect(result).toEqual(mockNewTask);
		expect(apiClient.post).toHaveBeenCalledWith(CARD_ENDPOINT.CARDS, {
			...newData,
			listId: 1,
		});
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const newData: Partial<Task> = { title: "new task" };

		await expect(createTask(1, newData)).rejects.toThrow("Network error");
	});
});

describe("updateTask", () => {
	test("should return an updated task successfully", async () => {
		const mockUpdatedTask: Task = {
			id: 1,
			title: "Updated task",
			listId: 1,
			description: "",
			position: 1,
			assignees: [],
		} as Task;

		(apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockUpdatedTask,
		});

		const updateData: Partial<Task> = { title: "Updated task" };

		const result = await updateTask("1", updateData);

		expect(result).toEqual(mockUpdatedTask);
		expect(apiClient.put).toHaveBeenCalledWith(
			CARD_ENDPOINT.BY_ID("1"),
			updateData,
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.put as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		const updateData: Partial<Column> = { title: "Updated column" };

		await expect(updateColumn("1", updateData)).rejects.toThrow(
			"Network error",
		);
	});
});

describe("deleteTask", () => {
	test("should delete a task successfully", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

		await deleteTask("1");

		expect(apiClient.delete).toHaveBeenCalledWith(CARD_ENDPOINT.BY_ID("1"));
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(deleteTask("1")).rejects.toThrow("Network error");
	});
});

describe("createInvitationLink", () => {
	test("should return an invitation link successfully", async () => {
		const mockInvitationLink = "http://localhost:3000/board/1/share";

		(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockInvitationLink,
		});

		const result = await createInvitationLink("1");

		expect(result).toEqual(mockInvitationLink);
		expect(apiClient.get).toHaveBeenCalledWith(
			`${BOARD_ENDPOINTS.BY_ID("1")}/share`,
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(createInvitationLink("1")).rejects.toThrow("Network error");
	});
});

describe("acceptInvitation", () => {
	test("should accept an invitation successfully", async () => {
		(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: undefined,
		});

		const result = await acceptInvitation("1", "invitation-token");

		expect(result).toBeUndefined();
		expect(apiClient.post).toHaveBeenCalledWith(
			`${BOARD_ENDPOINTS.BY_ID("1")}/invite`,
			{ token: "invitation-token", boardId: "1" },
		);
	});

	test("should throw an error if accepting the invitation fails", async () => {
		(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(acceptInvitation("1", "invitation-token")).rejects.toThrow(
			"Network error",
		);
	});
});

describe("getBoardUsers", () => {
	test("should return all board users successfully", async () => {
		const mockUsers: User[] = [
			{ id: 1, name: "user 1", email: "user1@test.com", photo: "photo.jpeg" },
			{ id: 2, name: "user 2", email: "user2@test.com", photo: "photo.jpeg" },
		];

		(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockUsers,
		});

		const result = await getBoardUsers("1");

		expect(result).toEqual(mockUsers);
		expect(apiClient.get).toHaveBeenCalledWith(
			`${BOARD_ENDPOINTS.BY_ID("1")}/users`,
		);
	});

	test("should throw an error when API request fails", async () => {
		(apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(getBoardUsers("1")).rejects.toThrow("Network error");
	});
});

describe("addAssignee", () => {
	test("should add an assignee successfully", async () => {
		const mockAssignee: User = {
			id: 1,
			name: "user 1",
			email: "user1@test.com",
			photo: "photo.jpeg",
		};

		(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({
			data: mockAssignee,
		});

		const result = await addAssignee(1, 1);

		expect(result).toEqual(mockAssignee);
		expect(apiClient.post).toHaveBeenCalledWith(
			`${CARD_ENDPOINT.CARDS}/addAssignee`,
			{
				cardId: 1,
				assigneeId: 1,
			},
		);
	});

	test("should throw an error when adding an assignee", async () => {
		(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(addAssignee(1, 1)).rejects.toThrow("Network error");
	});
});

describe("removeAssignee", () => {
	test("should remove an assignee successfully", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

		const result = await removeAssignee(1, 1);

		expect(result).toBeUndefined();
		expect(apiClient.delete).toHaveBeenCalledWith(
			`${CARD_ENDPOINT.CARDS}/removeAssignee/1/1`,
		);
	});

	test("should throw an error if API request fails", async () => {
		(apiClient.delete as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Network error"),
		);

		await expect(addAssignee(1, 1)).rejects.toThrow("Network error");
	});
});
