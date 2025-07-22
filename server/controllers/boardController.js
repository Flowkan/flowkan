import BoardModel from "../models/BoardModel.js";

export class BoardController {
     constructor(boardService) {
        this.boardService = boardService;
    }
    
    getAll = async (req, res) => {
        try {
            const boards = await this.boardService.getAllBoards();
            res.json(boards);
        } catch (err) {
            res.status(500).send('Error al obtener los tableros');
        }
    };
}