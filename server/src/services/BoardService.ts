import { Board, Prisma } from "@prisma/client";
import BoardModel, { BoardWithRelations, SafeUser } from "../models/BoardModel";


class BoardService {
  private readonly boardModel: BoardModel;

  constructor(boardModel: BoardModel) {
    this.boardModel = boardModel;
  }
  async getAllBoardsByUserId(
    userId: number,
    limit: number = 10,
    skip: number = 0,
  ): Promise<BoardWithRelations[]> {
    return this.boardModel.getAllByUserId(userId, limit, skip);
  }

  async getAllBoards(
    limit: number = 10,
    skip: number = 0,
  ): Promise<BoardWithRelations[]> {
    return this.boardModel.getAll(limit, skip);
  }

  async getBoardCountByUserId(userId: number): Promise<number> {
    return this.boardModel.getBoardCountByUserId(userId);
  }

  async getBoardByTitle(userId: number, boardName: string) {
    return this.boardModel.getBoardByTitle(userId, boardName);
  }

  async getBoardByMember(userId: number, boardName: string) {
    return this.boardModel.getBoardByMember(userId, boardName);
  }

  async get(data: {
    userId: number;
    boardId: number;
  }): Promise<BoardWithRelations | null> {
    return this.boardModel.get(data);
  }

  async add(data: {
    userId: number;
    title: string;
    slug: string;
    image?: string;
  }): Promise<Board> {
    const uniqueSlug = await this.findUniqueSlug(data.slug);
    return this.boardModel.add({
      ...data,
      slug: uniqueSlug,
    });
  }

  private async findUniqueSlug(baseSlug: string): Promise<string> {
    const existingSlugs = await this.boardModel.findMatchingSlugs(baseSlug);

    if (!existingSlugs.includes(baseSlug)) {
      return baseSlug;
    }

    let maxNumber = 0;

    existingSlugs.forEach((s: string) => {
      const regex = new RegExp(`^${baseSlug}-(\\d+)$`);

      const match = regex.exec(s);

      if (match) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });

    const newNumber = maxNumber + 1;
    return `${baseSlug}-${newNumber}`;
  }

  async update(data: {
    userId: number;
    boardId: number;
    data: Prisma.BoardUpdateInput;
  }): Promise<Board> {
    return this.boardModel.update(data);
  }

  async delete(data: { userId: number; boardId: number }): Promise<void> {
    return this.boardModel.delete(data);
  }

  async acceptInvitation(data: {
    boardId: number;
    userId: number;
  }): Promise<void> {
    return this.boardModel.addMember(data);
  }

  async getBoardUsers(data: {
    userId?: number;
    boardId: string;
  }): Promise<SafeUser[]> {
    return this.boardModel.getBoardUsers(data);
  }
}

export default BoardService;
