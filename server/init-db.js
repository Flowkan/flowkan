import prisma from './config/db.js';
import bcrypt from "bcrypt";
import readline from "readline";

const rl = readline.createInterface({
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

async function main() {
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
  .catch((e) => {
    console.error("❌ Error inicializando datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
