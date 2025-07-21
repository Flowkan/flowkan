import { Router } from 'express';
import prisma from '../config/db.js';
import BoardModel from '../models/BoardModel.js';
import BoardService from '../services/BoardService.js';
import { BoardController } from "../controllers/boardController.js";

const router = Router();


// Inyección de dependencias
const model = new BoardModel(prisma);
const service = new BoardService(model);
const controller = new BoardController(service);

router.get(
  "/",
  controller.getAll
);

export default router;