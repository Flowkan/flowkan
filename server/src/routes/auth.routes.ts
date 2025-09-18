import { Router } from "express";
import prisma from "../config/db";
import AuthModel from "../models/AuthModel";
import AuthService from "../services/AuthService";
import { AuthController } from "../controllers/authController";
import { validateUserFields } from "../validators/authValidator";
import { changePasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validators/authSchema";
import { upload, processAvatar } from "../lib/uploadConfigure";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import passport from "passport";

const router = Router();

const model = new AuthModel(prisma);
const service = new AuthService(model);
const controller = new AuthController(service);

router.post("/login", validateUserFields(loginSchema), controller.login);

router.post(
  "/register",
  upload.single("photo"),
  processAvatar,
  validateUserFields(registerSchema),
  controller.register,
);

router.get("/me", jwtAuth.guard, controller.me);
router.post("/confirm", controller.confirmEmail);
router.post("/reset_password",validateUserFields(resetPasswordSchema), controller.resetPassword);
router.post("/change_password",jwtAuth.verifyTokenEnabled,validateUserFields(changePasswordSchema), controller.changePassword);


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
