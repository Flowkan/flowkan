import { Board, Prisma, PrismaClient, User } from "@prisma/client";

const boardWithRelationsData = Prisma.validator<Prisma.BoardFindManyArgs>()({
  include: {
    lists: {
      orderBy: { position: "asc" },
      include: {
        cards: {
          orderBy: { position: "asc" },
          include: {
            assignees: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    },
    members: { include: { user: true } },
    labels: true,
    owner: true,
  },
});
export type BoardWithRelations = Prisma.BoardGetPayload<
  typeof boardWithRelationsData
>;

class BoardModel {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<BoardWithRelations[]> {
    return await this.prisma.board.findMany(boardWithRelationsData);
  }

  async getAllByUserId(userId: number): Promise<BoardWithRelations[]> {
    return await this.prisma.board.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      ...boardWithRelationsData,
    });
  }

  async getBoardByTitle(
    userId: number,
    boardTitle: string,
  ): Promise<BoardWithRelations | null> {
    return this.prisma.board.findFirst({
      where: {
        title: {
          contains: boardTitle,
          mode: "insensitive",
        },
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      ...boardWithRelationsData,
    });
  }

  async getBoardByMember(
    userId: number,
    memberSearch: string,
  ): Promise<BoardWithRelations[]> {
    return this.prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        members: {
          some: {
            user: {
              OR: [
                { name: { contains: memberSearch, mode: "insensitive" } },
                { email: { contains: memberSearch, mode: "insensitive" } },
              ],
            },
          },
        },
      },
      ...boardWithRelationsData,
    });
  }

  async get({
    userId,
    boardId,
  }: {
    userId: number;
    boardId: string;
  }): Promise<BoardWithRelations | null> {
    return await this.prisma.board.findFirst({
      where: {
        id: Number(boardId),
        members: {
          some: {
            userId: userId,
          },
        },
      },
      ...boardWithRelationsData,
    });
  }

  async add({
    title,
    userId,
  }: {
    title: string;
    userId: number;
  }): Promise<Board> {
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

  async update({
    userId,
    boardId,
    data,
  }: {
    userId: number;
    boardId: string;
    data: Prisma.BoardUpdateInput;
  }): Promise<Board> {
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

  async delete({
    userId,
    boardId,
  }: {
    userId: number;
    boardId: string;
  }): Promise<void> {
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

  async addMember(data: { boardId: number; userId: number }): Promise<void> {
    await this.prisma.boardMember.create({
      data: {
        boardId: data.boardId,
        userId: data.userId,
        role: "member",
      },
    });
  }

  async getBoardUsers({
    userId,
    boardId,
  }: {
    userId: number;
    boardId: string;
  }): Promise<User[]> {
    const members = await this.prisma.boardMember.findMany({
      where: {
        boardId: Number(boardId),
      },
      include: {
        user: true,
      },
    });

    return members.map((m) => m.user);
  }
}

export default BoardModel;
