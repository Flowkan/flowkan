import { Router } from "express";
import { CardController } from "../controllers/cardController.js";
import CardModel from "../models/CardModel.js";
import CardService from "../services/CardService.js";
import prisma from "../config/db.js";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware.js";
import {
  validateCardCreate,
  validateCardUpdate,
} from "../validators/cardValidators.js";

const router = Router();

const model = new CardModel(prisma);
const service = new CardService(model);
const controller = new CardController(service);

router.get("/", jwtAuth.guard, controller.getAllCards);
router.get("/:id", jwtAuth.guard, controller.getCard);
router.post("/", jwtAuth.guard, validateCardCreate, controller.addCard);
router.put("/:id", jwtAuth.guard, validateCardUpdate, controller.updateCard);
router.delete("/:id", jwtAuth.guard, controller.deleteCard);

export default router;
