import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import sharp from "sharp";

const uploadPath = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
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

export async function processAvatar(
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
}
