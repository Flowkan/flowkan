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

  get = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const board = await this.boardService.get({ userId, boardId });
      res.json(board);
    } catch (err) {
      console.log("eaer", err);
      res.status(500).send("Error al obtener el tablero");
    }
  };

  add = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const { title } = req.body;
      const board = await this.boardService.add({ userId, title });
      res.status(201).json(board);
    } catch (err) {
      res.status(500).send("Error al crear el tablero");
    }
  };

  update = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const { title } = req.body;
      const data = { title };
      const board = await this.boardService.update({ userId, boardId, data });
      res.status(200).json(board);
    } catch (err) {
      res.status(500).send("Error al actualizar el tablero");
    }
  };

  delete = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      await this.boardService.delete({ userId, boardId });
      res.status(204).json({});
    } catch (err) {
      console.log("errsaddsfdsdsafor", err);
      res.status(500).send("Error al eliminar el tablero");
    }
  };
}
