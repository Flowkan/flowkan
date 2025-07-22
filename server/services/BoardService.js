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
}

export default BoardService;
