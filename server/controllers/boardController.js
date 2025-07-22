export class BoardController {
  constructor(boardService) {
    this.boardService = boardService;
  }

  getAll = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const boards = await this.boardService.getAllBoards(userId);
      res.json(boards);
    } catch (err) {
      res.status(500).send("Error al obtener los tableros");
    }
  };
}
