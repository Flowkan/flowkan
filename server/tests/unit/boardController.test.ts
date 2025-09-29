import { BoardController } from "../../src/controllers/boardController";
import AuthService from "../../src/services/AuthService";
import BoardService from "../../src/services/BoardService";
import { deleteImage } from "../../src/utils/fileUtils";

const mockBoardService = {
  getAllBoardsByUserId: jest.fn(),
  getBoardCountByUserId: jest.fn(),
  get: jest.fn(),
  getBoardByTitle: jest.fn(),
  getBoardByMember: jest.fn(),
  add: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  acceptInvitation: jest.fn(),
  getBoardUsers: jest.fn(),
} as unknown as BoardService;

const mockAuthService = {
  findById: jest.fn(),
} as unknown as AuthService;

jest.mock("../../src/utils/fileUtils", () => ({
  deleteImage: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

let boardController: BoardController;
let req: any;
let res: any;

beforeEach(() => {
  jest.clearAllMocks();

  boardController = new BoardController(mockBoardService, mockAuthService);

  req = {
    apiUserId: 1,
    params: {},
    query: {},
    body: {},
  };

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
});

describe("boardController - happy path", () => {
  test("should return all boards with default pagination", async () => {
    const mockBoards = [
      { id: 1, title: "Board 1" },
      { id: 2, title: "Board 2" },
    ];
    mockBoardService.getAllBoardsByUserId = jest
      .fn()
      .mockResolvedValue(mockBoards);

    await boardController.getAll(req, res);

    expect(mockBoardService.getAllBoardsByUserId).toHaveBeenCalledWith(
      1,
      10,
      0,
    );
    expect(mockBoardService.getAllBoardsByUserId).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBoards);
  });

  test("should return all boards with total count when withCount=true", async () => {
    const mockBoards = [
      { id: 1, title: "Board 1" },
      { id: 2, title: "Board 2" },
    ];
    const mockTotalCount = 5;

    mockBoardService.getAllBoardsByUserId = jest
      .fn()
      .mockResolvedValue(mockBoards);
    mockBoardService.getBoardCountByUserId = jest
      .fn()
      .mockResolvedValue(mockTotalCount);

    req.query.withCount = "true";

    await boardController.getAll(req, res);

    expect(mockBoardService.getAllBoardsByUserId).toHaveBeenCalledWith(
      1,
      10,
      0,
    );
    expect(mockBoardService.getBoardCountByUserId).toHaveBeenCalledWith(1);
    expect(mockBoardService.getBoardCountByUserId).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      boards: mockBoards,
      totalCount: mockTotalCount,
      page: 1,
      limit: 10,
    });
  });

  test("should return a board by ID", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    const mockBoard = { userId: 1, title: "Board 1" };
    mockBoardService.get = jest.fn().mockResolvedValue(mockBoard);

    await boardController.get(req, res);

    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(mockBoardService.get).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBoard);
  });

  test("should return a board by title", async () => {
    req.apiUserId = 1;
    req.query.title = "Board 1";

    const mockBoards = [{ userId: 1, title: "Board 1", ownerId: 1 }];
    mockBoardService.getBoardByTitle = jest.fn().mockResolvedValue(mockBoards);

    await boardController.getBoardByTitle(req, res);

    expect(mockBoardService.getBoardByTitle).toHaveBeenCalledWith(1, "Board 1");
    expect(mockBoardService.getBoardByTitle).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBoards);
  });

  test("should return a board by member", async () => {
    req.apiUserId = 1;
    req.query.member = "Member 1";

    const mockBoards = [
      { id: 1, title: "Board 1", ownerId: 1 },
      { id: 2, title: "Board 2", ownerId: 2 },
    ];
    mockBoardService.getBoardByMember = jest.fn().mockResolvedValue(mockBoards);

    await boardController.getBoardByMember(req, res);

    expect(mockBoardService.getBoardByMember).toHaveBeenCalledWith(
      1,
      "Member 1",
    );
    expect(mockBoardService.getBoardByMember).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBoards);
  });

  test("should create a new board", async () => {
    req.apiUserId = 1;
    req.body = { title: "Board 1" };

    const mockBoard = { id: 1, title: "Board 1", ownerId: 1 };
    mockBoardService.add = jest.fn().mockResolvedValue(mockBoard);

    await boardController.add(req, res);

    expect(mockBoardService.add).toHaveBeenCalledWith({
      userId: 1,
      title: "Board 1",
      image: undefined,
      slug: "board-1",
    });
    expect(mockBoardService.add).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockBoard);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should return an updated board with new title", async () => {
    req.apiUserId = 1;
    req.params.id = "1";
    req.body = { title: "New Title" };

    const mockBoard = { id: 1, title: "New Title", ownerId: 1 };
    mockBoardService.update = jest.fn().mockResolvedValue(mockBoard);

    await boardController.update(req, res);

    expect(mockBoardService.update).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
      data: { title: "New Title" },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBoard);
  });

  test("should return an updated board with new image", async () => {
    res.apiUserId = 1;
    req.params.id = "1";
    req.body = { image: "new-image.webp" };

    const mockCurrentBoard = {
      id: 1,
      title: "Board 1",
      ownerId: 1,
      image: "old-image.webp",
    };
    const mockUpdatedBoard = {
      id: 1,
      title: "Board 1",
      ownerId: 1,
      image: "/uploads/boards/new-image.webp",
    };
    mockBoardService.get = jest
      .fn()
      .mockResolvedValueOnce(mockCurrentBoard)
      .mockResolvedValueOnce(mockUpdatedBoard);

    mockBoardService.update = jest.fn().mockResolvedValue(mockUpdatedBoard);

    await boardController.update(req, res);

    expect(mockBoardService.update).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
      data: { image: "/uploads/boards/new-image.webp" },
    });
    expect(deleteImage).toHaveBeenCalledWith({
      originalImagePath: "/uploads/boards/old-image_o.webp",
      thumbnailImagePath: "/uploads/boards/old-image_t.webp",
    });
  });
});
