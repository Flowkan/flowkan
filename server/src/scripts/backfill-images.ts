// This only applies to boards that existed before adding the image field.

import prisma from "../config/db";
import dotenv from "dotenv";
import pickDefaultImage from "../lib/defaultImage";

dotenv.config();

async function main() {
  const boards = await prisma.board.findMany({ where: { image: null } });
  for (const b of boards) {
    await prisma.board.update({
      where: { id: b.id },
      data: { image: pickDefaultImage() },
    });
  }

  console.log("Backfill completed: ", boards.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

/* async function resetImages() {
  await prisma.board.updateMany({
    data: { image: null },
  });
  console.log("Todas las imágenes han sido reseteadas a null");
}

resetImages()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect()); */
