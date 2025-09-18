"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CardService {
    cardModel;
    constructor(cardModel) {
        this.cardModel = cardModel;
    }
    async getAllCards(userId, listId) {
        return this.cardModel.getAll(listId, userId);
    }
    async getCardById(userId, cardId) {
        return this.cardModel.getById(cardId, userId);
    }
    async createCard(data) {
        return this.cardModel.create(data);
    }
    async updateCard(userId, cardId, data) {
        const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
        if (!isMember) {
            throw new Error("No tienes permiso para actualizar esta tarjeta");
        }
        return this.cardModel.update(cardId, data);
    }
    async deleteCard(userId, cardId) {
        const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
        if (!isMember) {
            throw new Error("No tienes permiso para eliminar esta tarjeta");
        }
        return this.cardModel.delete(cardId);
    }
    async addAssignee(userId, cardId, assigneeId) {
        const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
        if (!isMember) {
            throw new Error("No tienes permiso para asignar usuarios a esta tarjeta");
        }
        const cardAssignee = await this.cardModel.addAssignee(cardId, assigneeId);
        return cardAssignee.user;
    }
    async removeAssignee(userId, cardId, assigneeId) {
        const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
        if (!isMember) {
            throw new Error("No tienes permiso para eliminar asignaciones en esta tarjeta");
        }
        return this.cardModel.removeAssignee(cardId, assigneeId);
    }
}
exports.default = CardService;
