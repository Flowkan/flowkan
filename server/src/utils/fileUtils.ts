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
    // normalise: remove leading slashes for path.join
    const relOriginal = originalImagePath.replace(/^\/+/, "");
    const relThumbnail = thumbnailImagePath.replace(/^\/+/, "");

    const absOriginal = path.join(process.cwd(), "public", relOriginal);
    const absThumbnail = path.join(process.cwd(), "public", relThumbnail);

    console.log("deleteImage: comprobando rutas:", {
      absOriginal,
      absThumbnail,
    });

    if (fs.existsSync(absOriginal)) {
      try {
        fs.unlinkSync(absOriginal);
        console.log(`Original borrada: ${absOriginal}`);
      } catch (error) {
        console.error("Error buscando original: ", error);
      }
    } else {
      console.log("Original no encontrado (no se borra): ", absOriginal);
    }

    if (fs.existsSync(absThumbnail)) {
      try {
        fs.unlinkSync(absThumbnail);
        console.log(`Thumbnail borrada: ${absThumbnail}`);
      } catch (error) {
        console.error("Error buscando thumbnail: ", error);
      }
    } else {
      console.log("Thumbnail no encontrado (no se borra): ", absThumbnail);
    }
  } catch (err) {
    console.log("Error borrando imagen: ", err);
  }
}
