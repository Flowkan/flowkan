import { Prisma, PrismaClient } from "@prisma/client";

export interface CardCreateParams {
  title: string;
  description: string;
  position: number;
  listId: number;
}

export default class CardModel {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(listId: number, userId: number) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      select: { boardId: true },
    });

    if (!list) return [];

    const isMember = await this._isUserBoardMember(userId, list.boardId);
    if (!isMember) return [];

    return this.prisma.card.findMany({
      where: { listId },
    });
  }

  async getById(cardId: number, userId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      include: {
        list: {
          select: { boardId: true },
        },
      },
    });

    if (!card) return null;

    const isMember = await this._isUserBoardMember(userId, card.list.boardId);
    if (!isMember) return null;

    return card;
  }

  async create({ title, description, position, listId }: CardCreateParams) {
    return this.prisma.card.create({
      data: {
        title,
        description,
        position,
        list: { connect: { id: listId } },
      },
    });
  }

  async update(cardId: number, data: Prisma.CardUpdateInput) {
    return this.prisma.card.update({
      where: { id: cardId },
      data,
      include: {
        assignees: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async delete(cardId: number) {
    return this.prisma.card.delete({
      where: { id: cardId },
    });
  }

  async isUserBoardMember(userId: number, cardId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: {
        list: {
          select: { boardId: true },
        },
      },
    });

    if (!card) return false;

    return this._isUserBoardMember(userId, card.list.boardId);
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

  async addAssignee(cardId: number, userId: number) {
    return this.prisma.cardAssignee.create({
      data: {
        cardId,
        userId,
      },
      include: {
        user: true,
      },
    });
  }

  async removeAssignee(cardId: number, userId: number) {
    return this.prisma.cardAssignee.delete({
      where: {
        cardId_userId: {
          cardId,
          userId,
        },
      },
    });
  }
}
