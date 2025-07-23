import express from "express";
import createError from "http-errors";
import boardRoutes from "./routes/boards.routes.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/lists", listRoutes);
app.use("/api/v1/cards", cardRoutes);

app.use((req, res, next) => {
  if (!req.url.startsWith("/api")) {
    return res.status(404).send("Ruta no válida");
  }
  next(createError(404));
});

app.use((err, req, res, next) => {
  if (req.url.startsWith("/api")) {
    res.status(err.status || 500).json({ error: err.message });
  } else {
    res.status(err.status || 500).send("Error del servidor");
  }
});

export default app;
