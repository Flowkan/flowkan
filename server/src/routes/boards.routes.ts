import { Router } from "express";
import prisma from "../config/db.js";
import BoardModel from "../models/BoardModel.js";
import BoardService from "../services/BoardService.js";
import { BoardController } from "../controllers/boardController.js";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware.js";
import AuthService from "../services/AuthService.js";
import AuthModel from "../models/AuthModel.js";

const router = Router();

// Inyección de dependencias
const model = new BoardModel(prisma);
const service = new BoardService(model);
const authModel = new AuthModel(prisma);
const authService = new AuthService(authModel);
const controller = new BoardController(service, authService);

router.get("/", jwtAuth.guard, controller.getAll);
router.get("/:id", jwtAuth.guard, controller.get);
router.post("/", jwtAuth.guard, controller.add);
router.put("/:id", jwtAuth.guard, controller.update);
router.delete("/:id", jwtAuth.guard, controller.delete);

router.get("/:id/share", jwtAuth.guard, controller.shareBoard);
router.post("/:id/invite", jwtAuth.guard, controller.acceptInvitation);

export default router;
