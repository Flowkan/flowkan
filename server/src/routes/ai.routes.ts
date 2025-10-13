import { Router } from "express";
import { generateDescription } from "../controllers/aiController";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";

const router = Router();

router.post("/generate-description", jwtAuth.guard, generateDescription);

export default router;
