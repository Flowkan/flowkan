import { List, Prisma } from "@prisma/client";
import ListModel, { ListCreateParams } from "../models/ListModel";

export default class ListService {
  private listModel: ListModel
  constructor(listModel: ListModel) {
    this.listModel = listModel;
  }

  async getAllLists(userId: number, boardId: number): Promise<List[]> {
    return this.listModel.getAll(boardId, userId);
  }

  async getListById(userId: number, listId: number): Promise<List | null> {
    return this.listModel.getById(listId, userId);
  }

  async createList(data: ListCreateParams): Promise<List> {
    return this.listModel.create(data);
  }

  async updateList(userId: number, listId: number, data: Prisma.ListUpdateInput) {
    const isMember = await this.listModel.isUserBoardMember(userId, listId);
    if (!isMember) {
      throw new Error("No tienes permiso para actualizar esta lista");
    }

    return this.listModel.update(listId, data);
  }

  async deleteList(userId: number, listId: number) {
    const isMember = await this.listModel.isUserBoardMember(userId, listId);
    if (!isMember) {
      throw new Error("No tienes permiso para eliminar esta lista");
    }

    return this.listModel.delete(listId);
  }
}
