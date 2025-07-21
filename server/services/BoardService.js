class BoardService {
  constructor(boardModel) {
    this.boardModel = boardModel;
  }

  async getAllBoards() {
    return this.boardModel.getAll();
  }
}

export default BoardService;