import { Request, Response, NextFunction, RequestHandler } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

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

      // thumbnail
      await sharp(req.file.buffer)
        .resize(sizes.thumb)
        .webp({ quality: 80 })
        .toFile(thumbPath);

      req.body[bodyField] = baseName;

      next();
    } catch (err) {
      next(err);
    }
  };
}

/* export async function processAvatar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) return next();

    const baseName = `${Date.now()}`;

    const originalPath = path.join(uploadPath, `${baseName}_o.webp`);
    const thumbPath = path.join(uploadPath, `${baseName}_t.webp`);

    await sharp(req.file.buffer).webp({ quality: 90 }).toFile(originalPath);

    await sharp(req.file.buffer)
      .resize(100, 100)
      .webp({ quality: 80 })
      .toFile(thumbPath);

    req.body.photo = baseName;

    next();
  } catch (err) {
    next(err);
  }
} */
