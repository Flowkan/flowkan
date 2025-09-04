import express, { NextFunction, Request, Response } from "express";
import createError, { HttpError } from "http-errors";
import cors from "cors";
import boardRoutes from "./routes/boards.routes.js";
import listRoutes from "./routes/list.routes.js";
import cardRoutes from "./routes/card.routes.js";
import authRoutes from "./routes/auth.routes.js";
import {
  ApiValidationError,
  ValidationError,
} from "./validators/validationError.js";

const app = express();
app.disable("x-powered-by");

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/boards", boardRoutes);
app.use("/api/v1/lists", listRoutes);
app.use("/api/v1/cards", cardRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  if (!req.url.startsWith("/api")) {
    return res.status(404).send("Ruta no válida");
  }
  next(createError(404));
});

type FlowKanError = ValidationError | HttpError | Error;
type ApiResponse =
  | { error: string; details?: ApiValidationError[] }
  | { error: string };

app.use(
  (err: FlowKanError, req: Request, res: Response, next: NextFunction) => {
    let status: number;
    let responseData: ApiResponse;

    if (res.headersSent) {
      return next(err);
    }

    if (err instanceof ValidationError) {
      status = err.status;
      const validationDetails = err.errors
        .map((e) => `${e.location} "${e.field}" ${e.msg}`)
        .join(", ");

      const errorMessage = `Error de validación: ${validationDetails}`;
      responseData = { error: errorMessage, details: err.errors };
    } else if (err instanceof HttpError) {
      status = err.status;
      responseData = { error: err.message };
    } else {
      status = 500;
      responseData = { error: err.message || "Error interno del servidor" };
    }

    res.status(status);

    if (req.url.startsWith("/api")) {
      return res.json(responseData);
    }

    res.locals.message = responseData.error;
    res.render("Error en el servidor");
  },
);

export default app;
