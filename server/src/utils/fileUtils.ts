import fs from "fs";
import path from "path";

interface DeleteImageProps {
  originalImagePath: string;
  thumbnailImagePath: string;
}

export function deleteImage({
  originalImagePath,
  thumbnailImagePath,
}: DeleteImageProps) {
  try {
    const relOriginal = originalImagePath.replace(/^\/+/, "");
    const relThumbnail = thumbnailImagePath.replace(/^\/+/, "");

    const absOriginal = path.join(process.cwd(), "public", relOriginal);
    const absThumbnail = path.join(process.cwd(), "public", relThumbnail);

    if (fs.existsSync(absOriginal)) {
      try {
        fs.unlinkSync(absOriginal);
      } catch (error) {
        console.error("Error buscando original: ", error);
      }
    }

    if (fs.existsSync(absThumbnail)) {
      try {
        fs.unlinkSync(absThumbnail);
      } catch (error) {
        console.error("Error buscando thumbnail: ", error);
      }
    }
  } catch (err) {
    console.log("Error borrando imagen: ", err);
  }
}
