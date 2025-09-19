import { Router } from "express";
import prisma from "../config/db";
import BoardModel from "../models/BoardModel";
import BoardService from "../services/BoardService";
import { BoardController } from "../controllers/boardController";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import AuthService from "../services/AuthService";
import AuthModel from "../models/AuthModel";
import { processImage, upload } from "../lib/uploadConfigure";

const router = Router();

// Inyección de dependencias
const model = new BoardModel(prisma);
const service = new BoardService(model);
const authModel = new AuthModel(prisma);
const authService = new AuthService(authModel);
const controller = new BoardController(service, authService);

router.get("/", jwtAuth.guard, controller.getAll);
router.get("/:id", jwtAuth.guard, controller.get);
router.post(
  "/",
  jwtAuth.guard,
  upload.single("image"),
  processImage(
    "boards",
    { original: {}, thumb: { width: 200, height: 200 } },
    "image",
  ),
  controller.add,
);
router.put(
  "/:id",
  jwtAuth.guard,
  upload.single("image"),
  processImage(
    "boards",
    { original: {}, thumb: { width: 200, height: 200 } },
    "image",
  ),
  controller.update,
);
router.delete("/:id", jwtAuth.guard, controller.delete);

router.get("/:id/share", jwtAuth.guard, controller.shareBoard);
router.post("/:id/invite", jwtAuth.guard, controller.acceptInvitation);

router.get("/:id/users", jwtAuth.guard, controller.boardUsers);

export default router;
