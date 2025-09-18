"use strict";
// This only applies to boards that existed before adding the image field.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const pickDefaultImage_1 = __importDefault(require("../lib/pickDefaultImage"));
dotenv_1.default.config();
async function main() {
    const boards = await db_1.default.board.findMany({ where: { image: null } });
    for (const b of boards) {
        await db_1.default.board.update({
            where: { id: b.id },
            data: { image: (0, pickDefaultImage_1.default)() },
        });
    }
    console.log("Backfill completed: ", boards.length);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => db_1.default.$disconnect());
/* async function resetImages() {
  await prisma.board.updateMany({
    data: { image: null },
  });
  console.log("Todas las imágenes han sido reseteadas a null");
}

resetImages()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect()); */
