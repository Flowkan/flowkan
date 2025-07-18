import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  console.log("Esta versión del servidor está corriendo muy bien");
  res.send("Hola mundo desde ESM");
});

app.get("/db", async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        lists: true,
        members: {
          include: { user: true },
        },
      },
    });
    res.json(boards);
  } catch (err) {
    res.status(500).send("Error al conectar a la base de datos");
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
