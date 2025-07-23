export default class ListModel {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(boardId, userId) {
    const isMember = await this._isUserBoardMember(userId, boardId);
    if (!isMember) return [];

    return this.prisma.list.findMany({
      where: { boardId },
      include: {
        cards: true,
      },
    });
  }

  async getById(listId, userId) {
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

  async create({ title, boardId, position }) {
    return this.prisma.list.create({
      data: {
        title,
        boardId,
        position,
      },
    });
  }

  async update(listId, data) {
    return this.prisma.list.update({
      where: { id: listId },
      data,
    });
  }

  async delete(listId) {
    await this.prisma.card.deleteMany({
      where: { listId },
    });

    return this.prisma.list.delete({
      where: { id: listId },
    });
  }

  async isUserBoardMember(userId, listId) {
    const list = await this.prisma.list.findUnique({
      where: { id: listId },
      select: { boardId: true },
    });

    if (!list) return false;

    return this._isUserBoardMember(userId, list.boardId);
  }

  async _isUserBoardMember(userId, boardId) {
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
