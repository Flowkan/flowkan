import { Router } from "express";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware.js";
import { ProfileController } from "../controllers/profileController.js";

const router = Router()
const controller = new ProfileController()

router.get('/',jwtAuth.guard,controller.partial)

export default router;