"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.processImage = processImage;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const sharp_1 = __importDefault(require("sharp"));
const rootUploadPath = path_1.default.join(process.cwd(), "public", "uploads");
if (!fs_1.default.existsSync(rootUploadPath)) {
    fs_1.default.mkdirSync(rootUploadPath, { recursive: true });
}
const storage = multer_1.default.memoryStorage();
function imageFileFilter(_req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed"));
    }
}
exports.upload = (0, multer_1.default)({
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
function processImage(subfolder, sizes, bodyField) {
    return async function (req, res, next) {
        try {
            if (!req.file)
                return next();
            const uploadPath = path_1.default.join(rootUploadPath, subfolder);
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath, { recursive: true });
            }
            const baseName = `${Date.now()}`;
            const originalPath = path_1.default.join(uploadPath, `${baseName}_o.webp`);
            const thumbPath = path_1.default.join(uploadPath, `${baseName}_t.webp`);
            // original version
            let original = (0, sharp_1.default)(req.file.buffer).webp({ quality: 90 });
            if (sizes.original.width || sizes.original.height) {
                original = original.resize(sizes.original);
            }
            await original.toFile(originalPath);
            // thumbnail
            await (0, sharp_1.default)(req.file.buffer)
                .resize(sizes.thumb)
                .webp({ quality: 80 })
                .toFile(thumbPath);
            req.body[bodyField] = baseName;
            next();
        }
        catch (err) {
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
