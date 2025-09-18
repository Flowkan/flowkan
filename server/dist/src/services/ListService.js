"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ListService {
    listModel;
    constructor(listModel) {
        this.listModel = listModel;
    }
    async getAllLists(userId, boardId) {
        return this.listModel.getAll(boardId, userId);
    }
    async getListById(userId, listId) {
        return this.listModel.getById(listId, userId);
    }
    async createList(data) {
        return this.listModel.create(data);
    }
    async updateList(userId, listId, data) {
        const isMember = await this.listModel.isUserBoardMember(userId, listId);
        if (!isMember) {
            throw new Error("No tienes permiso para actualizar esta lista");
        }
        return this.listModel.update(listId, data);
    }
    async deleteList(userId, listId) {
        const isMember = await this.listModel.isUserBoardMember(userId, listId);
        if (!isMember) {
            throw new Error("No tienes permiso para eliminar esta lista");
        }
        return this.listModel.delete(listId);
    }
}
exports.default = ListService;
