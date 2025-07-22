class BoardModel {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return await this.prisma.board.findMany({
      include: {
        lists: true,
        members: { include: { user: true } },
      },
    });
  }

  async getAllByUserId(userId) {
    return await this.prisma.board.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        lists: true,
        members: { include: { user: true } },
      },
    });
  }

  async get({ userId, boardId }) {
    return await this.prisma.board.findFirst({
      where: {
        id: Number(boardId),
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        lists: true,
        members: { include: { user: true } },
      },
    });
  }

  async add({ title, userId }) {
    return await this.prisma.board.create({
      data: {
        title: title,
        ownerId: userId,
        members: {
          create: [{ userId: userId, role: "admin" }],
        },
      },
    });
  }

  async update({ userId, boardId, data }) {
    const board = await this.prisma.board.findUnique({
      where: { id: Number(boardId) },
      select: { ownerId: true },
    });

    if (!board) {
      throw new Error("Board no encontrado");
    }

    if (board.ownerId !== Number(userId)) {
      throw new Error("No tienes permiso para actualizar este board");
    }

    return await this.prisma.board.update({
      where: {
        id: Number(boardId),
      },
      data,
    });
  }

  async delete({ userId, boardId }) {
    const board = await this.prisma.board.findUnique({
      where: { id: Number(boardId) },
      select: { ownerId: true },
    });

    if (!board) {
      throw new Error("Board no encontrado");
    }

    if (board.ownerId !== Number(userId)) {
      throw new Error("No tienes permiso para actualizar este board");
    }

    await this.prisma.boardMember.deleteMany({
      where: { boardId: Number(boardId) },
    });

    await this.prisma.board.delete({
      where: {
        id: Number(boardId),
      },
    });
  }
}

export default BoardModel;
