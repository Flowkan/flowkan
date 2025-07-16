import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hola mundo desde ESM");
});

app.get("/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error al conectar a la base de datos");
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
