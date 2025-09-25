import { List, Prisma, PrismaClient } from "@prisma/client";


export interface ListCreateParams {
  title: string;
  boardId: number;
  position: number;
}

export default class ListModel {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(boardId: number, userId: number) {
    const isMember = await this._isUserBoardMember(userId, boardId);
    if (!isMember) return [];

    return this.prisma.list.findMany({
      where: { boardId },
      include: {
        cards: true,
      },
    });
  }

  async getById(listId: number, userId: number) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      include: {
        board: { select: { id: true, ownerId: true, members: true } },
        cards: true,
      },
    });

    if (!list) return null;

    const isMember = await this._isUserBoardMember(userId, list.boardId);
    if (!isMember) return null;

    return list;
  }

  async create({ title, boardId, position }: ListCreateParams): Promise<List> {
    return this.prisma.list.create({
      data: {
        title,
        boardId,
        position,
      },
    });
  }

  async update(listId: number, data: Prisma.ListUpdateInput): Promise<List> {
    return this.prisma.list.update({
      where: { id: listId },
      data,
    });
  }

  async delete(listId: number) {
    await this.prisma.card.deleteMany({
      where: { listId },
    });

    return this.prisma.list.delete({
      where: { id: listId },
    });
  }

  async isUserBoardMember(userId: number, listId: number) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      select: { boardId: true },
    });

    if (!list) return false;

    return this._isUserBoardMember(userId, list.boardId);
  }

  async _isUserBoardMember(userId: number, boardId: number) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });

    return !!board;
  }
}
