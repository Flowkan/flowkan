import { NextFunction, Request, Response } from "express";
import ListService from "../services/ListService";
import createHttpError from "http-errors";

export class ListController {
  private listService: ListService;
  constructor(listService: ListService) {
    this.listService = listService;
  }

  getAllLists = async (req: Request, res: Response) => {
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

  getList = async (req: Request, res: Response) => {
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

  addList = async (req: Request, res: Response) => {
    try {
      const { title, boardId, position } = req.body;
      const list = await this.listService.createList({
        title,
        boardId,
        position,
      });
      const listWithCards = {
        ...list,
        cards: [],
      };
      res.status(201).json(listWithCards);
    } catch (err) {
      res.status(500).send("Error al crear la lista");
    }
  };

  updateList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.params.id);
      const data = req.body;
      const list = await this.listService.updateList(userId, listId, data);
      res.json(list);
    } catch (err) {
      if (err instanceof Error && err.message.includes("permiso")) {
        return next(
          createHttpError(403, err.message || "Error al actualizar la lista"),
        );
      }
      next(err);
    }
  };

  deleteList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      const listId = Number(req.params.id);
      await this.listService.deleteList(userId, listId);
      res.status(204).send();
    } catch (err) {
      if (err instanceof Error && err.message.includes("permiso")) {
        return next(
          createHttpError(403, err.message || "Error al eliminar la lista"),
        );
      }
      next(err);
    }
  };
}
