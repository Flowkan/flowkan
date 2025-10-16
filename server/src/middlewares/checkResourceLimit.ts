import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import jwt from "jsonwebtoken";

export const checkBoardLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.apiUserId;
    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado." });

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId },
      include: { plan: true },
    });

    if (!subscription?.plan) {
      return res.status(403).json({
        message: "No tienes un plan activo. Es necesario un plan base.",
        errorCode: "NO_ACTIVE_PLAN",
      });
    }

    const limit = subscription.plan.maxBoards;
    if (limit === null || limit === undefined) return next();

    const count = await prisma.board.count({ where: { ownerId: userId } });

    if (count >= limit) {
      return res.status(403).json({
        message: `Has alcanzado el límite de ${limit} tableros para tu plan (${subscription.plan.name}).`,
        errorCode: "LIMIT_BOARD_REACHED",
        limit,
        planName: subscription.plan.name,
      });
    }

    next();
  } catch (error) {
    console.error("Error en checkBoardLimit:", error);
    res.status(500).json({
      message: "Error verificando límite de tableros.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const checkTaskLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentUserId = req.apiUserId;
    if (!currentUserId)
      return res.status(401).json({ message: "Usuario no autenticado." });

    let boardId: number | undefined;

    if (req.params.boardId) {
      boardId = Number(req.params.boardId);
    } else if (req.body.listId) {
      const listId = Number(req.body.listId);
      const list = await prisma.list.findUnique({
        where: { id: listId },
        select: { boardId: true },
      });
      if (list) boardId = list.boardId;
    }

    if (!boardId) {
      return res
        .status(400)
        .json({ message: "No se pudo determinar el ID del tablero." });
    }

    const board = await prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true, title: true },
    });

    if (!board) {
      return res.status(404).json({ message: "Tablero no encontrado." });
    }

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: board.ownerId },
      include: { plan: true },
    });

    if (!subscription?.plan) {
      return res.status(403).json({
        message: "El propietario de este tablero no tiene un plan activo.",
        errorCode: "NO_ACTIVE_PLAN",
      });
    }

    const limit = subscription.plan.maxTasks;
    const planName = subscription.plan.name;

    if (limit === null || limit === undefined) return next();

    const count = await prisma.card.count({
      where: {
        list: {
          boardId: boardId,
        },
      },
    });

    if (count >= limit) {
      return res.status(403).json({
        message: `El tablero "${board.title}" ha alcanzado el límite de ${limit} tareas permitido por el plan (${planName}) del propietario.`,
        errorCode: "LIMIT_TASK_REACHED",
        limit: limit,
        planName: planName,
      });
    }

    next();
  } catch (error) {
    console.error("Error en checkTaskLimit:", error);
    res.status(500).json({
      message: "Error verificando límite de tareas.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};

export const checkBoardMembersLimit = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.apiUserId;
    let boardId: number | undefined;
    if (req.body?.boardId) {
      boardId = Number(req.body.boardId);
    } else if (req.params?.id) {
      boardId = Number(req.params.id);
    } else if (req.body?.token) {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        throw new Error(
          "JWT_SECRET no está configurado en las variables de entorno",
        );
      }

      try {
        const payload = jwt.verify(req.body.token, JWT_SECRET) as {
          boardId?: number;
        };
        if (payload.boardId) boardId = Number(payload.boardId);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Token de invitación inválido." });
      }
    }

    if (!userId)
      return res.status(401).json({ message: "Usuario no autenticado." });
    if (!boardId)
      return res.status(400).json({ message: "Falta boardId en la petición." });

    const board = await prisma.board.findUnique({
      where: { id: boardId },
    });

    if (!board)
      return res.status(404).json({ message: "Board no encontrado." });

    const subscription = await prisma.userSubscription.findUnique({
      where: { userId: board.ownerId },
      include: { plan: true },
    });

    if (!subscription?.plan) {
      return res.status(403).json({
        message: "El propietario de este tablero no tiene un plan activo.",
        errorCode: "NO_ACTIVE_PLAN",
      });
    }

    const limit = subscription.plan.maxMembersPerBoard;
    if (limit === null || limit === undefined) return next();

    const memberCount = await prisma.boardMember.count({
      where: { boardId },
    });

    if (memberCount >= limit) {
      return res.status(403).json({
        message: `Este tablero ya tiene el límite de ${limit} miembros según tu plan (${subscription.plan.name}).`,
        errorCode: "LIMIT_MEMBERS_REACHED",
        limit,
        planName: subscription.plan.name,
      });
    }

    next();
  } catch (error) {
    console.error("Error en checkBoardMembersLimit:", error);
    res.status(500).json({
      message: "Error verificando límite de miembros del tablero.",
      errorCode: "INTERNAL_SERVER_ERROR",
    });
  }
};
