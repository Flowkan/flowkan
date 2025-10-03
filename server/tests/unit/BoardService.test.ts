import BoardModel from "../../src/models/BoardModel";
import BoardService from "../../src/services/BoardService";

const mockBoardModel = {
  getAllByUserId: jest.fn(),
  getAll: jest.fn(),
  getBoardCountByUserId: jest.fn(),
  getBoardByTitle: jest.fn(),
  getBoardByMember: jest.fn(),
  get: jest.fn(),
  add: jest.fn(),
  findMatchingSlugs: jest.fn(), //private
  update: jest.fn(),
  delete: jest.fn(),
  addMember: jest.fn(),
  getBoardUsers: jest.fn(),
} as unknown as BoardModel;

let boardService: BoardService;

beforeEach(() => {
  jest.clearAllMocks();
  boardService = new BoardService(mockBoardModel);
});

describe("BoardService - happy path", () => {
  test("should return boards by user id", async () => {
    const mockBoards = [
      { id: 1, title: "TestBoard" },
      { id: 1, title: "OtherTestBoard" },
    ];
    mockBoardModel.getAllByUserId = jest.fn().mockResolvedValue(mockBoards);

    const result = await boardService.getAllBoardsByUserId(1, 10, 0);

    expect(result).toEqual(mockBoards);
    expect(mockBoardModel.getAllByUserId).toHaveBeenCalledWith(1, 10, 0);
    expect(mockBoardModel.getAllByUserId).toHaveBeenCalledTimes(1);
    expect(result.map((b) => b.title)).toEqual(["TestBoard", "OtherTestBoard"]);
  });

  test("should return all boards", async () => {
    const mockBoards = [
      { id: 1, title: "TestBoardId1" },
      { id: 1, title: "OtherTestBoardId1" },
      { id: 2, title: "TestBoardId2" },
    ];
    mockBoardModel.getAll = jest.fn().mockResolvedValue(mockBoards);

    const result = await boardService.getAllBoards(10, 0);

    expect(result).toEqual(mockBoards);
    expect(mockBoardModel.getAll).toHaveBeenCalledWith(10, 0);
    expect(mockBoardModel.getAll).toHaveBeenCalledTimes(1);
    expect(result.map((b) => b.title)).toEqual([
      "TestBoardId1",
      "OtherTestBoardId1",
      "TestBoardId2",
    ]);
  });

  test("should return the number of boards a user has", async () => {
    const mockBoards = [
      { id: 1, title: "TestBoard" },
      { id: 1, title: "OtherTestBoard" },
    ];
    mockBoardModel.getBoardCountByUserId = jest
      .fn()
      .mockResolvedValue(mockBoards);

    const result = await boardService.getBoardCountByUserId(1);

    expect(result).toEqual(mockBoards);
    expect(mockBoardModel.getBoardCountByUserId).toHaveBeenCalledWith(1);
    expect(mockBoardModel.getBoardCountByUserId).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(2);
  });

  test("should return a board by title", async () => {
    const mockBoards = [
      { id: 1, title: "TestBoardId1" },
      { id: 1, title: "OtherTestBoardId1" },
      { id: 2, title: "TestBoardId2" },
    ];
    mockBoardModel.getBoardByTitle = jest.fn().mockResolvedValue(mockBoards);

    const firstResult = await boardService.getBoardByTitle(2, "TestBoardId2");
    const secondResult = await boardService.getBoardByTitle(1, "TestBoardId1");

    expect(firstResult).toEqual(mockBoards);
    expect(secondResult).toEqual(mockBoards);
    expect(mockBoardModel.getBoardByTitle).toHaveBeenCalledTimes(2);
    expect(mockBoardModel.getBoardByTitle).toHaveBeenNthCalledWith(
      2,
      1,
      "TestBoardId1",
    );
  });

  test("should return a board by member", async () => {
    const mockBoards = [
      { id: 1, title: "TestBoardId1" },
      { id: 1, title: "OtherTestBoardId1" },
      { id: 2, title: "TestBoardId2" },
    ];
    mockBoardModel.getBoardByTitle = jest.fn().mockResolvedValue(mockBoards);

    const result = await boardService.getBoardByTitle(2, "TestBoardId2");

    expect(result).toEqual(mockBoards);
    expect(mockBoardModel.getBoardByTitle).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.getBoardByTitle).toHaveBeenCalledWith(
      2,
      "TestBoardId2",
    );
  });

  test("should return a board for a given user and board ID", async () => {
    const mockBoards = { data: { userId: 1, boardSlug: "board-1" } };
    mockBoardModel.get = jest.fn().mockResolvedValue(mockBoards);

    const result = await boardService.get({ userId: 1, boardSlug: "board-1" });

    expect(result).toEqual(mockBoards);
    expect(mockBoardModel.get).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.get).toHaveBeenCalledWith({
      userId: 1,
      boardSlug: "board-1",
    });
  });

  test("should return a new board", async () => {
    const mockNewBoard = {
      data: {
        userId: 1,
        title: "newBoard",
        slug: "newBoardSlug",
        image: "newBoardImg",
      },
    };
    mockBoardModel.add = jest.fn().mockResolvedValue(mockNewBoard);
    mockBoardModel.findMatchingSlugs = jest.fn().mockResolvedValue([]);

    const result = await boardService.add({
      userId: 1,
      title: "newBoard",
      slug: "newBoardSlug",
      image: "newBoardImg",
    });

    expect(result).toEqual(mockNewBoard);
    expect(mockBoardModel.add).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.add).toHaveBeenCalledWith({
      userId: 1,
      title: "newBoard",
      slug: "newBoardSlug",
      image: "newBoardImg",
    });
    expect(mockBoardModel.findMatchingSlugs).toHaveBeenCalledWith(
      "newBoardSlug",
    );
  });

  test("should return an updated board", async () => {
    const mockUpdatedBoard = { userId: 1, boardId: 1, title: "UpdatedTitle" };
    mockBoardModel.update = jest.fn().mockResolvedValue(mockUpdatedBoard);

    const result = await boardService.update({
      userId: 1,
      boardId: 1,
      data: { title: "UpdatedTitle" },
    });

    expect(result).toEqual(mockUpdatedBoard);
    expect(mockBoardModel.update).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.update).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
      data: {
        title: "UpdatedTitle",
      },
    });
    expect(result.title).toBe("UpdatedTitle");
  });

  test("should delete an existing board", async () => {
    mockBoardModel.delete = jest.fn().mockResolvedValue(undefined);

    const result = await boardService.delete({ userId: 1, boardId: 1 });

    expect(result).toBeUndefined();
    expect(mockBoardModel.delete).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.delete).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
  });

  test("should accept a board invitation for a given user", async () => {
    const mockInvitation = { boardId: 1, userId: 1, role: "member" };
    mockBoardModel.addMember = jest.fn().mockResolvedValue(mockInvitation);

    const result = await boardService.acceptInvitation({
      userId: 1,
      boardId: 1,
    });

    expect(result).toEqual(mockInvitation);
    expect(mockBoardModel.addMember).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.addMember).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
  });

  test("should return every member in a board", async () => {
    const mockUsers = [
      {
        id: 1,
        name: "User1",
        email: "u1@test.com",
        photo: null,
        status: "active",
      },
      {
        id: 2,
        name: "User2",
        email: "u2@test.com",
        photo: null,
        status: "active",
      },
      {
        id: 3,
        name: "User3",
        email: "u3@test.com",
        photo: null,
        status: "active",
      },
    ];
    mockBoardModel.getBoardUsers = jest.fn().mockResolvedValue(mockUsers);

    const result = await boardService.getBoardUsers({
      userId: 1,
      boardId: "1",
    });

    expect(result).toEqual(mockUsers);
    expect(result).toHaveLength(3);
    expect(result.map((u) => u.id)).toEqual([1, 2, 3]);
    expect(mockBoardModel.getBoardUsers).toHaveBeenCalledTimes(1);
    expect(mockBoardModel.getBoardUsers).toHaveBeenCalledWith({
      userId: 1,
      boardId: "1",
    });
  });
});

describe("BoardService - error path", () => {
  test("should throw an error if the board does not exist when update", async () => {
    mockBoardModel.update = jest.fn().mockImplementation(() => {
      throw new Error("Board no encontrado");
    });

    await expect(
      boardService.update({
        userId: 1,
        boardId: 1,
        data: { title: "BoardTitle" },
      }),
    ).rejects.toThrow("Board no encontrado");
    expect(mockBoardModel.update).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if the user is not the owner of the board when update", async () => {
    mockBoardModel.update = jest.fn().mockImplementation(() => {
      throw new Error("No tienes permiso para actualizar este board");
    });

    await expect(
      boardService.update({
        userId: 1,
        boardId: 1,
        data: { title: "BoardTitle" },
      }),
    ).rejects.toThrow("No tienes permiso para actualizar este board");
    expect(mockBoardModel.update).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if the board does not exist when delete", async () => {
    mockBoardModel.delete = jest.fn().mockImplementation(() => {
      throw new Error("Board no encontrado");
    });

    await expect(
      boardService.delete({ userId: 1, boardId: 1 }),
    ).rejects.toThrow("Board no encontrado");
    expect(mockBoardModel.delete).toHaveBeenCalledTimes(1);
  });

  test("should throw an error if the user is not the owner of the board when delete", async () => {
    mockBoardModel.delete = jest.fn().mockImplementation(() => {
      throw new Error("No tienes permiso para actualizar este board");
    });

    await expect(
      boardService.delete({ userId: 1, boardId: 1 }),
    ).rejects.toThrow("No tienes permiso para actualizar este board");
    expect(mockBoardModel.delete).toHaveBeenCalledTimes(1);
  });
});
