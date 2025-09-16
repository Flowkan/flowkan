import { Router } from "express";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import { ProfileController } from "../controllers/profileController";
import upload from "../lib/uploadConfigure";

const router = Router();
const controller = new ProfileController();

router.get("/", jwtAuth.guard, controller.getOne);
router.patch(
  "/:userId",
  jwtAuth.guard,
  upload.single("photo"),
  controller.partial,
);

export default router;
