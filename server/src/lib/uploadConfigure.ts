import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    const route = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(route)) {
      fs.mkdirSync(route, { recursive: true });
    }
    cb(null, route);
  },
  filename: function (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

// Filter para imágenes
function imageFileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only image files are allowed"));
  }
}

// Exportar multer tipado
const upload: multer.Multer = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

export default upload;