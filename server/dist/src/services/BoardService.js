"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BoardService {
    boardModel;
    constructor(boardModel) {
        this.boardModel = boardModel;
    }
    async getAllBoardsByUserId(userId, limit = 10, skip = 0) {
        return this.boardModel.getAllByUserId(userId, limit, skip);
    }
    async getAllBoards(limit = 10, skip = 0) {
        return this.boardModel.getAll(limit, skip);
    }
    async getBoardCountByUserId(userId) {
        return this.boardModel.getBoardCountByUserId(userId);
    }
    async getBoardByTitle(userId, boardName) {
        return this.boardModel.getBoardByTitle(userId, boardName);
    }
    async getBoardByMember(userId, boardName) {
        return this.boardModel.getBoardByMember(userId, boardName);
    }
    async get(data) {
        return this.boardModel.get(data);
    }
    async add(data) {
        return this.boardModel.add(data);
    }
    async update(data) {
        return this.boardModel.update(data);
    }
    async delete(data) {
        return this.boardModel.delete(data);
    }
    async acceptInvitation(data) {
        return this.boardModel.addMember(data);
    }
    async getBoardUsers(data) {
        return this.boardModel.getBoardUsers(data);
    }
}
exports.default = BoardService;
