import { Router } from "express";
import { ListController } from "../controllers/listController.js";
import ListModel from "../models/ListModel.js";
import ListService from "../services/ListService.js";
import prisma from "../config/db.js";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware.js";
import {
  validateListCreate,
  validateListUpdate,
} from "../validators/listValidators.js";

const router = Router();

const model = new ListModel(prisma);
const service = new ListService(model);
const controller = new ListController(service);

router.get("/", jwtAuth.guard, controller.getAllLists);
router.get("/:id", jwtAuth.guard, controller.getList);
router.post("/", jwtAuth.guard, validateListCreate, controller.addList);
router.put("/:id", jwtAuth.guard, validateListUpdate, controller.updateList);
router.delete("/:id", jwtAuth.guard, controller.deleteList);

export default router;
