import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export default upload;
