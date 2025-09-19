import { Request, Response } from "express";
import BoardService from "../services/BoardService";
import { Prisma } from "@prisma/client";
import { BoardWithRelations } from "../models/BoardModel";
import jwt from "jsonwebtoken";
import AuthService from "../services/AuthService";
import { isDefaultImage, pickDefaultImage } from "../lib/defaultImage";
import { deleteImage } from "../utils/fileUtils";

interface InvitationJwtPayload {
  boardId: string;
  inviterId: number;
  email: string;
  type: "board-invitation";
}

interface AcceptInvitationPayload {
  token: string;
  userId: number;
}

export class BoardController {
  private readonly boardService: BoardService;
  private readonly authService: AuthService;

  constructor(boardService: BoardService, authService: AuthService) {
    this.boardService = boardService;
    this.authService = authService;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const limit = Math.max(parseInt(req.query.limit as string) || 10, 1);
      const page = Math.max(parseInt(req.query.page as string) || 1, 1);
      const skip = (page - 1) * limit < 0 ? 0 : (page - 1) * limit;
      const withCount = req.query.withCount === "true";

      if (withCount) {
        const [boards, totalCount]: [BoardWithRelations[], number] =
          await Promise.all([
            this.boardService.getAllBoardsByUserId(userId, limit, skip),
            this.boardService.getBoardCountByUserId(userId),
          ]);
        return res.json({
          boards,
          totalCount,
          page,
          limit,
        });
      }

      const boards: BoardWithRelations[] =
        await this.boardService.getAllBoardsByUserId(userId, limit, skip);

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
      res.status(500).send("Error al obtener el tablero");
    }
  };

  getBoardByTitle = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boardTitle = String(req.query.title) || "";
      const boards = await this.boardService.getBoardByTitle(
        userId,
        boardTitle,
      );
      res.json(boards);
    } catch (error) {
      res.status(404).send("No existen tableros con este nombre");
    }
  };

  getBoardByMember = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boardMember = String(req.query.member) || "";
      const boards = await this.boardService.getBoardByMember(
        userId,
        boardMember,
      );
      res.json(boards);
    } catch (error) {
      res.status(404).send("No hay tableros con este miembro");
    }
  };

  add = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const { title }: { title: string } = req.body;

      const image = req.body.image
        ? `/uploads/boards/${req.body.image}_o.webp`
        : pickDefaultImage();

      const board = await this.boardService.add({ userId, title, image });
      res.status(201).json(board);
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send("Error al crear el tablero");
      }
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const { title, image }: { title?: string; image?: string } = req.body;
      const currentBoard = await this.boardService.get({ userId, boardId });

      const data: Prisma.BoardUpdateInput = {};

      if (title) {
        data.title = title;
      }

      if (image) {
        data.image = image;
      }

      const updatedBoard = await this.boardService.update({
        userId,
        boardId,
        data,
      });

      console.log("Hola 1");

      if (currentBoard?.image && !isDefaultImage(currentBoard.image)) {
        const imageFilename = currentBoard.image.replace("_o.webp", "");
        const originalToDelete = `/uploads/boards/${imageFilename}_o.webp`;
        const thumbnailToDelete = `/uploads/boards/${imageFilename}_t.webp`;
        deleteImage({
          originalImagePath: originalToDelete,
          thumbnailImagePath: thumbnailToDelete,
        });
      }

      console.log("Hola 2");

      res.status(200).json(updatedBoard);
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

  shareBoard = async (req: Request, res: Response) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const board = await this.boardService.get({ userId, boardId });
      const inviter = await this.authService.findById(userId);
      const payload = {
        boardId: boardId,
        inviterId: userId,
        type: "board-invitation",
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });

      res.status(201).json({
        token,
        inviterName: inviter?.name,
        boardTitle: board?.title,
        inviterPhoto: inviter?.photo,
        boardId,
      });
    } catch (err) {
      console.error("Error generating invitation link:", err);
      res.status(500).send("Error al generar el enlace de invitación");
    }
  };

  acceptInvitation = async (req: Request, res: Response) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET no está en las variables de entorno");
    }

    try {
      const { token } = req.body as { token: string };
      const userId = req.apiUserId;

      const payload = jwt.verify(token, JWT_SECRET) as InvitationJwtPayload;
      const { boardId } = payload;
      await this.boardService.acceptInvitation({
        boardId: Number(boardId),
        userId,
      });
      res.status(200).send(`¡Invitación aceptada para el tablero ${boardId}!`);
    } catch (err) {
      console.error(err);
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).send("Enlace de invitación inválido o expirado");
      }
      res.status(500).send("Error al aceptar la invitación");
    }
  };

  boardUsers = async (req: Request, res: Response) => {
    try {
      const userId = req.apiUserId;
      const boardId = req.params.id;
      const board = await this.boardService.getBoardUsers({ userId, boardId });
      res.json(board);
    } catch (err) {
      console.log("error", err);
      res.status(500).send("Error al obtener usuarios del tablero");
    }
  };
}
