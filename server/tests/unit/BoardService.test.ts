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
