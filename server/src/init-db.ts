import { Prisma } from "@prisma/client";
import prisma from "./config/db";
import bcrypt from "bcrypt";
import readline, { Interface } from "readline";

const rl: Interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askYesNo(question: string): Promise<boolean> {
  return new Promise((resolve) => {
    rl.question(`${question} (s/N): `, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "s");
    });
  });
}

const resetSequences = async (tables: string[]): Promise<void> => {
  const resetPromises = tables.map((table) => {
    return prisma.$executeRaw(
      Prisma.sql`ALTER SEQUENCE "${Prisma.raw(table)}_id_seq" RESTART WITH 1;`,
    );
  });
  await Promise.all(resetPromises);
};

async function main(): Promise<void> {
  const tablesReset = ["User", "Board", "List", "Card", "Label", "Comment"];
  const shouldReset = await askYesNo(
    "¿Deseas eliminar los datos existentes antes de continuar?",
  );

  if (shouldReset) {
    console.log("🧨 Eliminando datos existentes...");
    await prisma.cardAssignee.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.cardLabel.deleteMany();
    await prisma.card.deleteMany();
    await prisma.label.deleteMany();
    await prisma.list.deleteMany();
    await prisma.boardMember.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany();
    await resetSequences(tablesReset);
  }

  console.log("🟢 Insertando datos iniciales...");

  const plainPassword = "admin123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@demo.com",
      password: hashedPassword,
    },
  });

  const board = await prisma.board.create({
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
  .catch((e: Error) => {
    console.error("❌ Error inicializando datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });
