import { Router } from "express";
import prisma from "../config/db.js";
import AuthModel from "../models/AuthModel.js";
import AuthService from "../services/AuthService.js";
import { AuthController } from "../controllers/authController.js";
import { validateUserFields } from "../validators/authValidator";
import { loginSchema, registerSchema } from "../validators/authSchema";
import upload from "../lib/uploadConfigure";

//temporal
import * as jwtAuth from "../middlewares/jwtAuthMiddleware.js";
import passport from "passport";

const router = Router();

const model = new AuthModel(prisma);
const service = new AuthService(model);
const controller = new AuthController(service);

router.post("/login", validateUserFields(loginSchema), controller.login);

router.post(
  "/register",
  upload.single("photo"),
  validateUserFields(registerSchema),
  controller.register,
);

router.get("/me", jwtAuth.guard, controller.me);
router.post("/confirm", controller.confirmEmail);

router.get("/google", controller.googleAuth);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.handleOAuthCallback,
);

router.get("/github", controller.githubAuth);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  controller.handleOAuthCallback,
);

export default router;
