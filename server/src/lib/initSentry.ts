import * as Sentry from "@sentry/node";
import * as SentryProfiling from "@sentry/profiling-node";
import express from "express";

// Type guards para filtrar errores
export const hasMessage = (obj: unknown): obj is { message: string } =>
  obj !== null &&
  typeof obj === "object" &&
  "message" in obj &&
  typeof (obj as Record<string, unknown>).message === "string";

export const hasStatus = (obj: unknown): obj is { status: number } =>
  obj !== null &&
  typeof obj === "object" &&
  "status" in obj &&
  typeof (obj as Record<string, unknown>).status === "number";

let lastReset = Date.now();
let errorCount = 0;

export const sentryBeforeSend = (
  event: Sentry.ErrorEvent,
  hint: Sentry.EventHint,
) => {
  const error = hint.originalException;
  const now = Date.now();

  // No enviar abortados y de autenticacion
  if (hasMessage(error) && error.message.includes("AbortError")) return null;
  if (hasStatus(error) && error.status === 401) return null;

  // Rate Limit 60 segundos
  if (now - lastReset > 60000) {
    errorCount = 0;
    lastReset = now;
  }
  errorCount++;

  if (errorCount > 10) {
    console.warn(`Rate limit excedido: ${errorCount} errores en 60s`);
    return null;
  }

  // Borrar datos sensibles
  if (event.request) {
    delete event.request.cookies;
    // Borrar tokens de los headers
    if (event.request?.headers) {
      delete event.request.headers["Authorization"];
      delete event.request.headers["x-api-key"];
    }
    delete event.request.data;
  }
  return event;
};

export default function initSentry(app: express.Express) {
  const ENV = process.env.NODE_ENV;
  const DSN = process.env.SENTRY_DSN;
  const isProduction = ENV === "production" && !!DSN;

  if (!isProduction) {
    console.log("Sentry deshabilitado en desarrollo o falta DSN");
    return;
  }

  Sentry.init({
    dsn: DSN,
    tracesSampler: (samplerContext) => {
      if(samplerContext.name?.includes("prisma")) {
        return 0
      }
      return 0.1
    },
    integrations: [
      // Habilita trazas automáticas HTTP y Express
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      // Trazas para RabbitMQ, Prisma y Postgres
      Sentry.amqplibIntegration(),
      Sentry.prismaIntegration(),
      // Sentry.postgresIntegration(),

      SentryProfiling.nodeProfilingIntegration(),
      Sentry.consoleLoggingIntegration({
        levels: ["error"],
      }),
    ],
    tracePropagationTargets: ["localhost", /^https?:\/\/(www\.)?flowkan\.es/],
    environment: ENV,
    tracesSampleRate: ENV === "production" ? 0.1 : 1.0, // 1.0 = 100% de las transacciones (bajar en producción)
    profilesSampleRate: 0.1,
    enabled: isProduction,
    enableLogs: false,
    beforeSend: sentryBeforeSend,
  });
  app.use(Sentry.expressErrorHandler());

  // Errores no capturados
  process.on(
    "unhandledRejection",
    (reason: unknown, _promise: Promise<unknown>) => {
      const error =
        reason instanceof Error
          ? reason
          : new Error(
              typeof reason === "string" ? reason : JSON.stringify(reason),
            );
      Sentry.captureException(error);
      console.error("Unhandled Rejection:", error);
    },
  );
}
