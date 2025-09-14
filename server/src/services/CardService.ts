import { Card, Prisma } from "@prisma/client";
import CardModel, { CardCreateParams } from "../models/CardModel";

export default class CardService {
  private cardModel: CardModel;
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
}
