"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardModel {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(listId, userId) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            select: { boardId: true },
        });
        if (!list)
            return [];
        const isMember = await this._isUserBoardMember(userId, list.boardId);
        if (!isMember)
            return [];
        return this.prisma.card.findMany({
            where: { listId },
        });
    }
    async getById(cardId, userId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    select: { boardId: true },
                },
            },
        });
        if (!card)
            return null;
        const isMember = await this._isUserBoardMember(userId, card.list.boardId);
        if (!isMember)
            return null;
        return card;
    }
    async create({ title, description, position, listId }) {
        return this.prisma.card.create({
            data: {
                title,
                description,
                position,
                list: { connect: { id: listId } },
            },
        });
    }
    async update(cardId, data) {
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
    async delete(cardId) {
        return this.prisma.card.delete({
            where: { id: cardId },
        });
    }
    async isUserBoardMember(userId, cardId) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            select: {
                list: {
                    select: { boardId: true },
                },
            },
        });
        if (!card)
            return false;
        return this._isUserBoardMember(userId, card.list.boardId);
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
    async addAssignee(cardId, userId) {
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
    async removeAssignee(cardId, userId) {
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
exports.default = CardModel;
