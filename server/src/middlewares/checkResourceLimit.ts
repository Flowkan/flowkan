import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";

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

    const limit = subscription.plan.maxTasks;
    if (limit === null || limit === undefined) return next();

    const count = await prisma.card.count({
      where: {
        list: {
          board: { ownerId: userId },
        },
      },
    });

    if (count >= limit) {
      return res.status(403).json({
        message: `Has alcanzado el límite de ${limit} tareas para tu plan (${subscription.plan.name}).`,
        errorCode: "LIMIT_TASK_REACHED",
        limit,
        planName: subscription.plan.name,
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
