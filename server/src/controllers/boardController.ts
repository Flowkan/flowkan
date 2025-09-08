import { Request, Response } from "express";
import BoardService from "../services/BoardService";
import { Prisma } from "@prisma/client";
import { BoardWithRelations } from "../models/BoardModel";

export class BoardController {
  private boardService: BoardService;

  constructor(boardService: BoardService) {
    this.boardService = boardService;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boards: BoardWithRelations[] =
        await this.boardService.getAllBoardsByUserId(userId);
      res.json(boards);
    } catch (err) {
      res.status(500).send("Error al obtener los tableros");
    }
  };

  get = async (req: Request, res: Response) => {
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

  add = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const { title }: { title: string } = req.body;
      const board = await this.boardService.add({ userId, title });
      res.status(201).json(board);
    } catch (err) {
      res.status(500).send("Error al crear tablero :(");
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const { title }: { title?: string } = req.body;
      const data: Prisma.BoardUpdateInput = { title };
      const board = await this.boardService.update({ userId, boardId, data });
      res.status(200).json(board);
    } catch (err) {
      res.status(500).send("Error al actualizar el tablero");
    }
  };

  delete = async (req: Request, res: Response) => {
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
