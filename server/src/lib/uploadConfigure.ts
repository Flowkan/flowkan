import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const avatarStorage = multer.memoryStorage();

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

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export async function processAvatar(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) return next();

    const baseName = `${Date.now()}`;

    const originalPath = path.join(uploadDir, `${baseName}_o.webp`);
    const thumbPath = path.join(uploadDir, `${baseName}_t.webp`);

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
}

const mediaStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const taskId = req.params.id || "unknown";
    const ext = path.extname(file.originalname);
    const fileName = `${taskId}_${Date.now()}${ext || ".dat"}`;
    cb(null, fileName);
  },
});

export const uploadMedia = multer({
  storage: mediaStorage,
  limits: { fileSize: 20 * 1024 * 1024 }, // Límite de 20MB
});
