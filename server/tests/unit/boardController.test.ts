import { BoardController } from "../../src/controllers/boardController";
import AuthService from "../../src/services/AuthService";
import BoardService from "../../src/services/BoardService";
import { deleteImage } from "../../src/utils/fileUtils";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

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

/* jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
})); */
jest.mock("jsonwebtoken", () => {
  const actual = jest.requireActual("jsonwebtoken");
  return {
    ...actual,
    sign: jest.fn(),
    verify: jest.fn(),
  };
});

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

describe("boardController - error path", () => {
  const originalSecret = process.env.JWT_SECRET;

  afterEach(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  test("should throw an error when returning all boards", async () => {
    req.apiUserId = 1;
    req.query.limit = "10";
    req.query.page = "1";

    mockBoardService.getAllBoardsByUserId = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al obtener los tableros");
    expect(mockBoardService.getAllBoardsByUserId).toHaveBeenCalledWith(
      1,
      10,
      0,
    );
  });

  test("should throw an error when trying to get a board by ID", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.get(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al obtener el tablero");
    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
  });

  test("should throw an error when trying to get a board by title", async () => {
    req.apiUserId = 1;
    req.query.title = "Board";

    mockBoardService.getBoardByTitle = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.getBoardByTitle(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      "No existen tableros con este nombre",
    );
    expect(mockBoardService.getBoardByTitle).toHaveBeenCalledWith(1, "Board");
  });

  test("should throw an error when trying to get a board by member", async () => {
    req.apiUserId = 1;
    req.query.member = "Member";

    mockBoardService.getBoardByMember = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.getBoardByMember(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("No hay tableros con este miembro");
    expect(mockBoardService.getBoardByMember).toHaveBeenCalledWith(1, "Member");
  });

  test("should throw an error when trying to create a board", async () => {
    req.apiUserId = 1;
    req.body = { title: "New Board" };

    mockBoardService.add = jest
      .fn()
      .mockRejectedValue(new Error("database error"));

    await boardController.add(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al crear el tablero");
    expect(mockBoardService.add).toHaveBeenCalledWith({
      userId: 1,
      title: "New Board",
      slug: "new-board",
    });
  });

  test("should throw an error when trying to create a board with an image", async () => {
    req.apiUserId = 1;
    req.body = { title: "New Board", image: "new-board.webp" };

    mockBoardService.add = jest
      .fn()
      .mockRejectedValue(new Error("database error"));

    await boardController.add(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al crear el tablero");
    expect(mockBoardService.add).toHaveBeenCalledWith({
      userId: 1,
      title: "New Board",
      image: "/uploads/boards/new-board.webp",
      slug: "new-board",
    });
  });

  test("should throw an error when trying to update a board", async () => {
    req.apiUserId = 1;
    req.params.id = "1";
    req.body = { title: "Updated Board" };

    mockBoardService.get = jest
      .fn()
      .mockResolvedValue({ id: 1, title: "Old Board", ownerId: 1 });
    mockBoardService.update = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.update(req, res);

    expect(res.status).toHaveBeenLastCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al actualizar el tablero");
    expect(mockBoardService.update).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
      data: { title: "Updated Board" },
    });
  });

  test("should throw an error when trying to update a board with an image", async () => {
    req.apiUserId = 1;
    req.params.id = "1";
    req.body = { image: "updated-img.webp" };

    mockBoardService.get = jest.fn().mockResolvedValue({
      id: 1,
      title: "Old Board",
      ownerId: 1,
      image: "old-image.webp",
    });
    mockBoardService.update = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.update(req, res);

    expect(res.status).toHaveBeenLastCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al actualizar el tablero");
    expect(mockBoardService.update).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
      data: { image: "/uploads/boards/updated-img.webp" },
    });
  });

  test("should throw an error when trying to delete a board", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest
      .fn()
      .mockResolvedValue({ userId: 1, boardId: 1 });
    mockBoardService.delete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.delete(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al eliminar el tablero");
    expect(mockBoardService.delete).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
  });

  test("should return 500 if boardService.get fails", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest.fn().mockRejectedValue(new Error("DB error"));

    await boardController.shareBoard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Error al generar el enlace de invitación",
    );
    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
  });

  test("should return 500 if authService.findById fails", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest
      .fn()
      .mockResolvedValue({ id: 1, title: "Board 1" });
    mockAuthService.findById = jest
      .fn()
      .mockRejectedValue(new Error("DB error"));

    await boardController.shareBoard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Error al generar el enlace de invitación",
    );
    expect(mockBoardService.get).toHaveBeenCalledWith({
      userId: 1,
      boardId: 1,
    });
    expect(mockAuthService.findById).toHaveBeenCalledWith(1);
  });

  test("should return 500 if jwt.sign fails", async () => {
    process.env.JWT_SECRET = "test-secret";

    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.get = jest
      .fn()
      .mockResolvedValue({ id: 1, title: "Board 1" });
    mockAuthService.findById = jest
      .fn()
      .mockResolvedValue({ id: 1, name: "Test" });

    const jwtMock = jest.requireMock("jsonwebtoken") as { sign: jest.Mock };
    jwtMock.sign.mockImplementation(() => {
      throw new Error("Token generation failed");
    });

    await boardController.shareBoard(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Error al generar el enlace de invitación",
    );
  });

  test("should throw an error if JWT_SECRET is not defined", async () => {
    delete process.env.JWT_SECRET;

    req.apiUserId = 1;
    req.params.id = "1";

    await expect(boardController.shareBoard(req, res)).rejects.toThrow(
      "JWT_SECRET is not defined in environment variables",
    );
  });

  test("should throw an error if boardService.acceptInvitation fails", async () => {
    req.apiUserId = 1;
    req.body = { token: "fake-token" };

    const jwtMock = jest.requireMock("jsonwebtoken") as { verify: jest.Mock };
    jwtMock.verify.mockReturnValue({ boardId: "1" });

    mockBoardService.acceptInvitation = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("Error al aceptar la invitación");
    expect(mockBoardService.acceptInvitation).toHaveBeenCalledWith({
      boardId: 1,
      userId: 1,
    });
  });

  test("should return 401 if token is invalid or expired", async () => {
    req.apiUserId = 1;
    req.body = { token: "fake-token" };

    const jwtMock = jest.requireMock("jsonwebtoken") as { verify: jest.Mock };
    jwtMock.verify.mockImplementation(() => {
      throw new JsonWebTokenError("invalid token");
    });

    await boardController.acceptInvitation(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith(
      "Enlace de invitación inválido o expirado",
    );
  });

  test("should throw an error if JWT_SECRET is not defined for acceptInvitation", async () => {
    delete process.env.JWT_SECRET;

    req.apiUserId = 1;
    req.body = { token: "fake-token" };

    await expect(boardController.acceptInvitation(req, res)).rejects.toThrow(
      "JWT_SECRET no está en las variables de entorno",
    );
  });

  test("should return 500 if boardService.getBoardUsers fails", async () => {
    req.apiUserId = 1;
    req.params.id = "1";

    mockBoardService.getBoardUsers = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await boardController.boardUsers(req, res);

    expect(mockBoardService.getBoardUsers).toHaveBeenCalledWith({
      userId: 1,
      boardId: "1",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Error al obtener usuarios del tablero",
    );
  });
});
