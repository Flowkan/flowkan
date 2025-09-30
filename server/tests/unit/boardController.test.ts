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
  process.env.JWT_SECRET = "fake-secret";

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
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdatedBoard);
  });

  test("should delete an existing board without image", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest
      .fn()
      .mockResolvedValue({ id: 1, title: "Board 1" });
    mockBoardService.delete = jest.fn().mockResolvedValue(undefined);

    await boardController.delete(req, res);

    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(mockBoardService.delete).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({});
  });

  test("should delete an existing board with image", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    const mockCurrentBoard = {
      id: 1,
      title: "Board 1",
      ownerId: 1,
      image: "image.webp",
    };

    mockBoardService.get = jest.fn().mockResolvedValue(mockCurrentBoard);
    mockBoardService.delete = jest.fn().mockResolvedValue(undefined);

    await boardController.delete(req, res);

    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(mockBoardService.delete).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(deleteImage).toHaveBeenCalledWith({
      originalImagePath: "/uploads/boards/image_o.webp",
      thumbnailImagePath: "/uploads/boards/image_t.webp",
    });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({});
  });

  test("should generate an invitation link for a board", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    const mockBoard = {
      id: 1,
      title: "Board 1",
      ownerId: 1,
      slug: "board-1",
      image: "board.webp",
    };

    const mockInviter = {
      id: 1,
      name: "Test",
      photo: "photo.jpg",
    };

    const jwtMock = jest.requireMock("jsonwebtoken") as { sign: jest.Mock };
    jwtMock.sign.mockReturnValue("fake-token");

    mockBoardService.get = jest.fn().mockResolvedValue(mockBoard);
    mockAuthService.findById = jest.fn().mockResolvedValue(mockInviter);

    await boardController.shareBoard(req, res);

    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(mockAuthService.findById).toHaveBeenCalledWith(1);
    expect(jwtMock.sign).toHaveBeenCalledWith(
      { boardId: 1, inviterId: 1, type: "board-invitation" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      token: "fake-token",
      inviterName: "Test",
      boardTitle: "Board 1",
      inviterPhoto: "photo.jpg",
      boardId: 1,
      slug: "board-1",
    });
  });

  test("should accept a board invitation successfully", async () => {
    req.apiUserId = 1;
    req.body = { token: "fake-token" };

    const mockPayload = {
      boardId: "1",
      inviterId: 2,
      email: "test@test.com",
      type: "board-invitation",
    };

    const jwtMock = jest.requireMock("jsonwebtoken") as { verify: jest.Mock };
    jwtMock.verify.mockReturnValue(mockPayload);

    mockBoardService.acceptInvitation = jest.fn().mockResolvedValue(undefined);

    await boardController.acceptInvitation(req, res);

    expect(jwtMock.verify).toHaveBeenCalledWith(
      "fake-token",
      process.env.JWT_SECRET,
    );
    expect(mockBoardService.acceptInvitation).toHaveBeenCalledWith({
      boardId: 1,
      userId: 1,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      "¡Invitación aceptada para el tablero 1!",
    );
  });

  test("should return every member in a board", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    const mockUsers = [
      { userId: 1, boardId: "1", name: "User 1" },
      { userId: 2, boardId: "1", name: "User 2" },
      { userId: 3, boardId: "1", name: "User 3" },
    ];

    mockBoardService.getBoardUsers = jest.fn().mockResolvedValue(mockUsers);

    await boardController.boardUsers(req, res);

    expect(mockBoardService.getBoardUsers).toHaveBeenCalledWith({
      userId: 1,
      boardId: "1",
    });
    expect(mockBoardService.getBoardUsers).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });
});
