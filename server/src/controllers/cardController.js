export class CardController {
  constructor(cardService) {
    this.cardService = cardService;
  }

  getAllCards = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.body.listId);
      const cards = await this.cardService.getAllCards(userId, listId);
      res.json(cards);
    } catch (err) {
      res.status(500).send("Error al obtener las tarjetas");
    }
  };

  getCard = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.id);
      const card = await this.cardService.getCardById(userId, cardId);
      if (!card) return res.status(404).send("Tarjeta no encontrada");
      res.json(card);
    } catch (err) {
      res.status(500).send("Error al obtener la tarjeta");
    }
  };

  addCard = async (req, res) => {
    try {
      const { title, description, position, listId } = req.body;
      const card = await this.cardService.createCard({
        title,
        description,
        position,
        listId,
      });
      res.status(201).json(card);
    } catch (err) {
      res.status(500).send("Error al crear la tarjeta");
    }
  };

  updateCard = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.id);
      const data = req.body;
      const card = await this.cardService.updateCard(userId, cardId, data);
      res.json(card);
    } catch (err) {
      if (err.message.includes("permiso")) {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).send("Error al actualizar la tarjeta");
    }
  };

  deleteCard = async (req, res) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.id);
      await this.cardService.deleteCard(userId, cardId);
      res.status(204).send();
    } catch (err) {
      if (err.message.includes("permiso")) {
        return res.status(403).json({ message: err.message });
      }
      res.status(500).send("Error al eliminar la tarjeta");
    }
  };
}
