import { Board, Prisma, User } from "@prisma/client";
import BoardModel, { BoardWithRelations } from "../models/BoardModel";

class BoardService {
  private boardModel: BoardModel;

  constructor(boardModel: BoardModel) {
    this.boardModel = boardModel;
  }

  async getAllBoardsByUserId(userId: number): Promise<BoardWithRelations[]> {
    return this.boardModel.getAllByUserId(userId);
  }

  async getAllBoards(): Promise<BoardWithRelations[]> {
    return this.boardModel.getAll();
  }

  async getBoardByTitle(userId: number, boardName: string) {
    return this.boardModel.getBoardByTitle(userId, boardName)
  }

  async get(data: {
    userId: number;
    boardId: string;
  }): Promise<BoardWithRelations | null> {
    return this.boardModel.get(data);
  }

  async add(data: { userId: number; title: string }): Promise<Board> {
    return this.boardModel.add(data);
  }

  async update(data: {
    userId: number;
    boardId: string;
    data: Prisma.BoardUpdateInput;
  }): Promise<Board> {
    return this.boardModel.update(data);
  }

  async delete(data: { userId: number; boardId: string }): Promise<void> {
    return this.boardModel.delete(data);
  }

  async acceptInvitation(data: {
    boardId: number;
    userId: number;
  }): Promise<void> {
    return this.boardModel.addMember(data);
  }

  async getBoardUsers(data: {
    userId: number;
    boardId: string;
  }): Promise<User[]> {
    return this.boardModel.getBoardUsers(data);
  }
}

export default BoardService;
