import { Router } from "express";
import prisma from "../config/db.js";
import AuthModel from "../models/AuthModel.js";
import AuthService from "../services/AuthService.js";
import { AuthController } from "../controllers/authController.js";
import { validateUserFields } from "../validators/authValidator.js";

const router = Router();

const model = new AuthModel(prisma);
const service = new AuthService(model);
const controller = new AuthController(service);

router.post("/login", validateUserFields, controller.login);

router.post("/register", validateUserFields, controller.register);

export default router;
