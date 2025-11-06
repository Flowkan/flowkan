import { Router } from "express";
import { generateDescription } from "../controllers/aiController";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import { checkAiDescriptionLimit } from "../middlewares/checkResourceLimit";

const router = Router();

router.post(
  "/generate-description",
  jwtAuth.guard,
  checkAiDescriptionLimit,
  generateDescription,
);

export default router;
