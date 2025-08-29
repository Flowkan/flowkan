class BoardService {
  constructor(boardModel) {
    this.boardModel = boardModel;
  }

  async getAllBoardsByUserId(userId) {
    return this.boardModel.getAllByUserId(userId);
  }

  async getAllBoards() {
    return this.boardModel.getAll();
  }

  async get(data) {
    return this.boardModel.get(data);
  }

  async add(data) {
    return this.boardModel.add(data);
  }

  async update(userId, boardId, data) {
    return this.boardModel.update(userId, boardId, data);
  }

  async delete(userId, boardId) {
    return this.boardModel.delete(userId, boardId);
  }
}

export default BoardService;
