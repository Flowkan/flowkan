import { Router } from "express";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import { ProfileController } from "../controllers/profileController";
import { uploadAvatar, processAvatar } from "../lib/uploadConfigure";

const router = Router();
const controller = new ProfileController();

router.get("/", jwtAuth.guard, controller.getOne);
router.patch(
  "/:userId",
  jwtAuth.guard,
  uploadAvatar.single("photo"),
  processAvatar,
  controller.partial,
);

export default router;
