class BoardModel {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return this.prisma.board.findMany({
      include: {
        lists: true,
        members: { include: { user: true } },
      },
    });
  }

  async getAllByUserId(userId) {
    return this.prisma.board.findMany({
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
}

export default BoardModel;
