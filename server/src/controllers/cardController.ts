import { NextFunction, Request, Response } from "express";
import CardService from "../services/CardService";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export class CardController {
  private readonly cardService: CardService;
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
        return next(
          createHttpError(500, err.message || "Error al crear la tarjeta"),
        );
      }
      return next(
        createHttpError(500, "Error desconocido al crear la tarjeta"),
      );
    }
  };

  updateCard = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.apiUserId;
    const cardId = Number(req.params.id);

    const files = req.files as Express.Multer.File[] | undefined;

    const data = req.body;

    const removeMediaId = data.removeMediaId
      ? Number(data.removeMediaId)
      : undefined;

    if (removeMediaId !== undefined) {
      delete data.removeMediaId;
    }

    const uploadedFileNames: string[] = [];

    try {
      if (files && files.length > 0) {
        const mediaFilesData: {
          url: string;
          fileName: string;
          fileType: "document" | "audio";
        }[] = files.map((file) => {
          const fileUrl = `/uploads/boards/${cardId}/${file.filename}`;
          uploadedFileNames.push(file.filename);

          const fileType = file.mimetype.startsWith("audio/")
            ? "audio"
            : "document";

          return {
            url: fileUrl,
            fileName: file.originalname,
            fileType: fileType,
          };
        });

        await this.cardService.addMediaToCard(cardId, mediaFilesData);
      }

      if (removeMediaId !== undefined) {
        await this.cardService.removeMediaFromCard(
          userId,
          cardId,
          removeMediaId,
        );
      }

      const updatedCard = await this.cardService.updateCard(
        userId,
        cardId,
        data,
      );

      res.json(updatedCard);
    } catch (err) {
      if (err instanceof Error && err.message.includes("permiso")) {
        return next(
          createHttpError(403, err.message || "Error al actualizar la tarjeta"),
        );
      }

      if (uploadedFileNames.length > 0) {
        uploadedFileNames.forEach((filename) => {
          try {
            fs.unlinkSync(path.join(UPLOAD_DIR, filename));
          } catch (e) {
            console.error(
              `Error al eliminar el archivo subido: ${filename}`,
              e,
            );
          }
        });
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
        return next(
          createHttpError(
            403,
            err.message ? err.message : "Error al eliminar la lista",
          ),
        );
      }
      next(err);
    }
  };

  addAssignee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const { cardId, assigneeId } = req.body;

      const user = await this.cardService.addAssignee(
        userId,
        cardId,
        assigneeId,
      );
      res.status(201).json(user);
    } catch (err) {
      next(
        createHttpError(
          500,
          (err as Error).message || "Error al asignar usuario a la tarjeta",
        ),
      );
    }
  };

  removeAssignee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const cardId = Number(req.params.cardId);
      const assigneeId = Number(req.params.assigneeId);

      await this.cardService.removeAssignee(userId, cardId, assigneeId);
      res.status(204).send();
    } catch (err) {
      next(
        createHttpError(
          500,
          (err as Error).message || "Error al eliminar asignación",
        ),
      );
    }
  };
}
