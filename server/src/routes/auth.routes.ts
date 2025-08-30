import { Router } from "express";
import prisma from "../config/db.js";
import AuthModel from "../models/AuthModel.js";
import AuthService from "../services/AuthService.js";
import { AuthController } from "../controllers/authController.js";
import { validateUserFields } from "../validators/authValidator";
import { loginSchema, registerSchema } from "../validators/authSchema";

const router = Router();

const model = new AuthModel(prisma);
const service = new AuthService(model);
const controller = new AuthController(service);

router.post("/login", validateUserFields(loginSchema), controller.login);

router.post("/register", validateUserFields(registerSchema), controller.register);

export default router;
