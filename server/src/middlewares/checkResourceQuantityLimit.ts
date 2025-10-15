import { Request, Response, NextFunction } from "express";
import prisma from "../config/db";
import { PrismaClient } from "@prisma/client";

type CountableResourceModel = "board" | "column" | "label" | "card";

type CountablePlanLimitField =
  | "maxBoards"
  | "maxTasks"
  | "maxColumns"
  | "maxLabels"
  | "maxCards";

/**
 * Función de orden superior que genera un middleware para verificar límites de cantidad de recursos (COUNT).
 *
 * @param resourceModel El nombre del modelo en Prisma a contar (ej: 'board').
 * @param planLimitField El campo en el objeto 'plan' de la suscripción que contiene el límite (ej: 'maxBoards').
 * @param ownerField El campo en el recurso a contar que indica la propiedad (por defecto 'ownerId').
 * @returns
 */
export const checkResourceQuantityLimit = (
  resourceModel: CountableResourceModel,
  planLimitField: CountablePlanLimitField,
  ownerField: string = "ownerId",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.apiUserId;
      if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado." });
      }

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

      const { plan } = subscription;
      const typedPlan = plan as Partial<
        Record<CountablePlanLimitField, number | null>
      >;
      const limit = typedPlan[planLimitField];

      if (limit === null || limit === undefined) {
        return next();
      }

      const modelDelegate = prisma[resourceModel as keyof typeof prisma];
      const modelWithCount = modelDelegate as unknown as {
        count: (args: {
          where: { [key: string]: string | number };
        }) => Promise<number>;
      };
      const count = await modelWithCount.count({
        where: { [ownerField]: userId },
      });

      console.log(
        `Verificando límite para ${resourceModel}: Actual ${count} / Límite ${limit}`,
      );

      if (count >= limit) {
        return res.status(403).json({
          message: `Has alcanzado el límite de ${limit} ${resourceModel}s permitido para tu plan (${plan.name}).`,
          errorCode: "LIMIT_BOARD_REACHED",
          limit: limit,
          planName: plan.name,
        });
      }

      next();
    } catch (error) {
      console.error(
        `Error en checkResourceQuantityLimit para ${resourceModel}:`,
        error,
      );
      res.status(500).json({
        message: "Error verificando el límite del plan.",
        errorCode: "INTERNAL_SERVER_ERROR",
      });
    }
  };
};
