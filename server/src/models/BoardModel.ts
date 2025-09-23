import { Board, Prisma, PrismaClient, User } from "@prisma/client";

export const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  photo: true,
  status: true,
} satisfies Prisma.UserSelect;
export type SafeUser = Prisma.UserGetPayload<{ select: typeof safeUserSelect }>;

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
                user: {
                  select: safeUserSelect,
                },
              },
            },
            media: true,
          },
        },
      },
    },
    members: {
      include: {
        user: {
          select: safeUserSelect,
        },
      },
    },
    labels: true,
    owner: {
      select: safeUserSelect,
    },
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

  async getAll(limit: number, skip: number): Promise<BoardWithRelations[]> {
    return await this.prisma.board.findMany({
      ...boardWithRelationsData,
      take: limit,
      skip,
    });
  }

  async getAllByUserId(
    userId: number,
    limit: number = 10,
    skip: number = 0,
  ): Promise<BoardWithRelations[]> {
    return await this.prisma.board.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      ...boardWithRelationsData,
      take: limit,
      skip: skip,
    });
  }

  async getBoardCountByUserId(userId: number): Promise<number> {
    return this.prisma.board.count({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
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
    boardId: number;
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
    image,
    slug,
  }: {
    title: string;
    userId: number;
    image?: string;
    slug: string;
  }): Promise<Board> {
    return await this.prisma.board.create({
      data: {
        title: title,
        slug,
        ownerId: userId,
        members: {
          create: [{ userId: userId, role: "admin" }],
        },
        image,
      },
    });
  }

  async findMatchingSlugs(baseSlug: string): Promise<string[]> {
    const boards = await this.prisma.board.findMany({
      where: {
        slug: {
          startsWith: baseSlug,
        },
      },
      select: {
        slug: true,
      },
    });

    return boards.map((b) => b.slug);
  }

  async update({
    userId,
    boardId,
    data,
  }: {
    userId: number;
    boardId: number;
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
    boardId: number;
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
    userId?: number;
    boardId: string;
  }): Promise<SafeUser[]> {
    const members = await this.prisma.boardMember.findMany({
      where: {
        boardId: Number(boardId),
      },
      include: {
        user: {
          select: safeUserSelect,
        },
      },
    });

    return members.map((m) => m.user);
  }
}

export default BoardModel;
