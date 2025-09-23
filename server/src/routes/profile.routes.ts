import { Router } from "express";
import * as jwtAuth from "../middlewares/jwtAuthMiddleware";
import { ProfileController } from "../controllers/profileController";
import { upload, processImage } from "../lib/uploadConfigure";

const router = Router();
const controller = new ProfileController();

router.get("/", jwtAuth.guard, controller.getOne);
router.patch(
  "/:userId",
  jwtAuth.guard,
  upload.single("photo"),
  processImage(
    "users",
    { original: {}, thumb: { width: 100, height: 100 } },
    "photo",
  ),
  controller.partial,
);

export default router;
