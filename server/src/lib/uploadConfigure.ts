import { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";
import { sendToMakeThumbnailTask } from "../broker/producers/thumbnailProducer";

const rootUploadPath = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(rootUploadPath)) {
  fs.mkdirSync(rootUploadPath, { recursive: true });
}

const storage = multer.memoryStorage();

function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
}

export const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * Configurable image processor.
 * @param subfolder -  in which subfolder to save (e.g: "users", "boards")
 * @param sizes - which versions to generate
 * @param bodyField - which field in the body should be filled in (e.g: "avatar", "image")
 */

export function processImage(
  subfolder: "users" | "boards",
  sizes: {
    original: { width?: number; height?: number };
    thumb: { width?: number; height?: number };
  },
  bodyField: string,
): RequestHandler {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) return next();

      const uploadPath = path.join(rootUploadPath, subfolder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const baseName = `${Date.now()}`;

      const originalPath = path.join(uploadPath, `${baseName}_o.webp`);
      const thumbPath = path.join(uploadPath, `${baseName}_t.webp`);

      // original version
      let original = sharp(req.file.buffer).webp({ quality: 90 });
      if (sizes.original.width || sizes.original.height) {
        original = original.resize(sizes.original);
      }
      await original.toFile(originalPath);

      //Delegar la creación del thumbnail a un worker
      await sendToMakeThumbnailTask({
        userId: req.apiUserId,
        originalPath,
        thumbPath,
        thumbSize: {
          width: sizes.thumb.width ?? 200,
          height: sizes.thumb.height ?? 200,
        },
      });

      req.body[bodyField] = baseName;

      next();
    } catch (err) {
      next(err);
    }
  };
}

export const mediaStorage = multer.diskStorage({
  destination: (req, _file, cb) => {
    const taskId = req.params.id || "unknown";
    const subfolderPath = path.join(rootUploadPath, "boards", taskId);
    if (!fs.existsSync(subfolderPath)) {
      fs.mkdirSync(subfolderPath, { recursive: true });
    }
    cb(null, subfolderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext || ".dat"}`;
    cb(null, fileName);
  },
});

export const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Límite de 20MB
});

export const deletePhoto = async (
  subfolder: "users" | "boards",
  fileName: string,
) => {
  if (!fileName) return;

  const originalPath = path.join(
    rootUploadPath,
    subfolder,
    `${fileName}_o.webp`,
  );
  const thumbPath = path.join(rootUploadPath, subfolder, `${fileName}_t.webp`);

  for (const filePath of [originalPath, thumbPath]) {
    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
    } catch (error) {
      console.error("Error al borrar: ", filePath, error);
    }
  }
};
