import { NextFunction, Request, Response } from "express";
import CardService from "../services/CardService";
import createHttpError from "http-errors";

export class CardController {
  private cardService: CardService
  constructor(cardService: CardService) {
    this.cardService = cardService;
  }

  getAllCards = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.body.listId);
      const cards = await this.cardService.getAllCards(userId, listId);
      res.json(cards);
    } catch (err) {
      res.status(500).send("Error al obtener las tarjetas");
    }
  };

  getCard = async (req: Request, res: Response) => {
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

  addCard = async (req: Request, res: Response, next: NextFunction) => {
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
      if (err instanceof Error) {
        return next(createHttpError(500, err.message || "Error al crear la tarjeta"));
      }
      return next(createHttpError(500, "Error desconocido al crear la tarjeta"))
    }
  };

  updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.id);
      const data = req.body;
      const card = await this.cardService.updateCard(userId, cardId, data);
      res.json(card);
    } catch (err) {
      if (err instanceof Error && err.message.includes("permiso")) {
        return next(createHttpError(403, err.message ||  "Error al actualizar la tarjeta"));
      }
      next(err);
    }
  };

  deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.id);
      await this.cardService.deleteCard(userId, cardId);
      res.status(204).send();
    } catch (err) {
      if (err instanceof Error && err.message.includes("permiso")) {
        return next(createHttpError(403, err.message ? err.message :  "Error al eliminar la lista"));
      }
      next(err);
    }
  };
}
