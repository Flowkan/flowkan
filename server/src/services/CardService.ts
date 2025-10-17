import { Card, Prisma } from "@prisma/client";
import CardModel, { CardCreateParams } from "../models/CardModel";
import * as fs from "fs";
import * as path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export default class CardService {
  private readonly cardModel: CardModel;
  constructor(cardModel: CardModel) {
    this.cardModel = cardModel;
  }

  async getAllCards(userId: number, listId: number): Promise<Card[]> {
    return this.cardModel.getAll(listId, userId);
  }

  async getCardById(userId: number, cardId: number): Promise<Card | null> {
    return this.cardModel.getById(cardId, userId);
  }

  async createCard(data: CardCreateParams): Promise<Card> {
    return this.cardModel.create(data);
  }

  async updateCard(
    userId: number,
    cardId: number,
    data: Prisma.CardUpdateInput,
  ) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error("No tienes permiso para actualizar esta tarjeta");
    }

    return this.cardModel.update(cardId, data);
  }

  async addMediaToCard(
    cardId: number,
    mediaList: {
      url: string;
      fileName: string;
      fileType: "document" | "audio";
      sizeMB: number;
    }[],
  ) {
    const dataToCreate = mediaList.map((media) => ({
      ...media,
      cardId: cardId,
    }));

    return this.cardModel.createCardMedia(dataToCreate);
  }

  async removeMediaFromCard(userId: number, cardId: number, mediaId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error(
        "No tienes permiso para eliminar adjuntos de esta tarjeta",
      );
    }

    const mediaItem = await this.cardModel.getMediaById(mediaId);

    if (!mediaItem || mediaItem.cardId !== cardId) {
      return;
    }

    await this.cardModel.deleteMedia(mediaId);

    const filename = mediaItem.url.split("/").pop();
    if (filename) {
      const filePath = path.join(UPLOAD_DIR, filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (e) {
        console.error(
          `Advertencia: No se pudo eliminar el archivo físico: ${filePath}`,
          e,
        );
      }
    }
  }

  async deleteCard(userId: number, cardId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error("No tienes permiso para eliminar esta tarjeta");
    }

    return this.cardModel.delete(cardId);
  }

  async addAssignee(userId: number, cardId: number, assigneeId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error("No tienes permiso para asignar usuarios a esta tarjeta");
    }
    const cardAssignee = await this.cardModel.addAssignee(cardId, assigneeId);
    return cardAssignee.user;
  }

  async removeAssignee(userId: number, cardId: number, assigneeId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error(
        "No tienes permiso para eliminar asignaciones en esta tarjeta",
      );
    }
    return this.cardModel.removeAssignee(cardId, assigneeId);
  }

  async addLabelToCard(userId: number, cardId: number, labelId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error(
        "No tienes permiso para asignar etiquetas en esta tarjeta",
      );
    }
    return this.cardModel.addLabelToCard(cardId, labelId);
  }

  async removeLabelFromCard(userId: number, cardId: number, labelId: number) {
    const isMember = await this.cardModel.isUserBoardMember(userId, cardId);
    if (!isMember) {
      throw new Error(
        "No tienes permiso para eliminar etiquetas en esta tarjeta",
      );
    }
    return this.cardModel.removeLabelFromCard(cardId, labelId);
  }

  async getMediaAttachmentDetails(mediaId: number) {
    return this.cardModel.getMediaDetails(mediaId);
  }

  async updateStorageUsedMB(userId: number, deltaSize: number) {
    try {
      const result = await this.cardModel.updateUserStorage(userId, deltaSize);
      return result;
    } catch (e) {
      console.error(e);
    }
  }
}
