"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const boardWithRelationsData = client_1.Prisma.validator()({
    include: {
        lists: {
            orderBy: { position: "asc" },
            include: {
                cards: {
                    orderBy: { position: "desc" },
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
class BoardModel {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(limit, skip) {
        return await this.prisma.board.findMany({
            ...boardWithRelationsData,
            take: limit,
            skip,
        });
    }
    async getAllByUserId(userId, limit = 10, skip = 0) {
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
    async getBoardCountByUserId(userId) {
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
    async getBoardByTitle(userId, boardTitle) {
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
    async getBoardByMember(userId, memberSearch) {
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
    async get({ userId, boardId, }) {
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
    async add({ title, userId, image, }) {
        return await this.prisma.board.create({
            data: {
                title: title,
                ownerId: userId,
                members: {
                    create: [{ userId: userId, role: "admin" }],
                },
                image: image ?? null,
            },
        });
    }
    async update({ userId, boardId, data, }) {
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
    async delete({ userId, boardId, }) {
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
    async addMember(data) {
        await this.prisma.boardMember.create({
            data: {
                boardId: data.boardId,
                userId: data.userId,
                role: "member",
            },
        });
    }
    async getBoardUsers({ userId, boardId, }) {
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
exports.default = BoardModel;
