import { Router } from "express";
import { CardController } from "../controllers/cardController";
import CardModel from "../models/CardModel";
import CardService from "../services/CardService";
import prisma from "../config/db";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import { validateCard } from "../validators/cardValidators";
import { cardCreateSchema, cardUpdateSchema } from "../validators/cardSchema";
import { uploadMedia } from "../lib/uploadConfigure";

const router = Router();

const model = new CardModel(prisma);
const service = new CardService(model);
const controller = new CardController(service);

router.get("/", jwtAuth.guard, controller.getAllCards);
router.get("/:id", jwtAuth.guard, controller.getCard);
router.post(
  "/",
  jwtAuth.guard,
  validateCard(cardCreateSchema),
  controller.addCard,
);
router.put(
  "/:id",
  jwtAuth.guard,
  uploadMedia.array("attachments"),
  validateCard(cardUpdateSchema),
  controller.updateCard,
);
router.delete("/:id", jwtAuth.guard, controller.deleteCard);

router.post("/addAssignee", jwtAuth.guard, controller.addAssignee);
router.delete(
  "/removeAssignee/:cardId/:assigneeId",
  jwtAuth.guard,
  controller.removeAssignee,
);

router.post(
  "/:cardId/labels/:labelId",
  jwtAuth.guard,
  controller.addLabelToCard,
);
router.delete(
  "/:cardId/labels/:labelId",
  jwtAuth.guard,
  controller.removeLabelFromCard,
);

export default router;
