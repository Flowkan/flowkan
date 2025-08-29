export class ListController {
  constructor(listService) {
    this.listService = listService;
  }

  getAllLists = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const boardId = Number(req.body.boardId);
      const lists = await this.listService.getAllLists(userId, boardId);
      res.json(lists);
    } catch (err) {
      console.log("asdfasd", err);
      res.status(500).send("Error al obtener las listas");
    }
  };

  getList = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.params.id);
      const list = await this.listService.getListById(userId, listId);
      if (!list) return res.status(404).send("Lista no encontrada");
      res.json(list);
    } catch (err) {
      res.status(500).send("Error al obtener la lista");
    }
  };

  addList = async (req, res) => {
    try {
      const { title, boardId, position } = req.body;
      const list = await this.listService.createList({
        title,
        boardId,
        position,
      });
      res.status(201).json(list);
    } catch (err) {
      res.status(500).send("Error al crear la lista");
    }
  };

  updateList = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.params.id);
      const data = req.body;
      const list = await this.listService.updateList(userId, listId, data);
      res.json(list);
    } catch (err) {
      if (err.message.includes("permiso")) {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).send("Error al actualizar la lista");
    }
  };

  deleteList = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.params.id);
      await this.listService.deleteList(userId, listId);
      res.status(204).send();
    } catch (err) {
      if (err.message.includes("permiso")) {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).send("Error al eliminar la lista");
    }
  };
}
