"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("./config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function askYesNo(question) {
    return new Promise((resolve) => {
        rl.question(`${question} (s/N): `, (answer) => {
            rl.close();
            resolve(answer.trim().toLowerCase() === "s");
        });
    });
}
const resetSequences = async (tables) => {
    const resetPromises = tables.map((table) => {
        return db_1.default.$executeRaw(client_1.Prisma.sql `ALTER SEQUENCE "${client_1.Prisma.raw(table)}_id_seq" RESTART WITH 1;`);
    });
    await Promise.all(resetPromises);
};
async function main() {
    const tablesReset = ["User", "Board", "List", "Card", "Label", "Comment"];
    const shouldReset = await askYesNo("¿Deseas eliminar los datos existentes antes de continuar?");
    if (shouldReset) {
        console.log("🧨 Eliminando datos existentes...");
        await db_1.default.cardAssignee.deleteMany();
        await db_1.default.comment.deleteMany();
        await db_1.default.cardLabel.deleteMany();
        await db_1.default.card.deleteMany();
        await db_1.default.label.deleteMany();
        await db_1.default.list.deleteMany();
        await db_1.default.boardMember.deleteMany();
        await db_1.default.board.deleteMany();
        await db_1.default.user.deleteMany();
        await resetSequences(tablesReset);
    }
    console.log("🟢 Insertando datos iniciales...");
    const plainPassword = "admin123";
    const hashedPassword = await bcrypt_1.default.hash(plainPassword, 10);
    const user = await db_1.default.user.upsert({
        where: { email: "admin@demo.com" },
        update: {},
        create: {
            name: "Admin",
            email: "admin@demo.com",
            password: hashedPassword,
            status: true,
        },
    });
    const board = await db_1.default.board.create({
        data: {
            title: "Board de ejemplo",
            ownerId: user.id,
            members: {
                create: [{ userId: user.id, role: "admin" }],
            },
            lists: {
                create: [
                    { title: "Pendiente", position: 1 },
                    { title: "En progreso", position: 2 },
                    { title: "Hecho", position: 3 },
                ],
            },
        },
    });
    console.log("✅ Datos creados:", { userId: user.id, boardId: board.id });
}
main()
    .catch((e) => {
    console.error("❌ Error inicializando datos:", e);
    process.exit(1);
})
    .finally(async () => {
    rl.close();
    await db_1.default.$disconnect();
});
