import * as Sentry from "@sentry/node";
import * as SentryProfiling from "@sentry/profiling-node";
import express from "express";

export default function initSentry(app: express.Express) {

  if (!process.env.SENTRY_DSN) {
    console.log("Sentry no está habilitado en desarrollo o falta SENTRY_DSN");
    return;
  }
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // Habilita trazas automáticas HTTP y Express
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      // Trazas para RabbitMQ, Prisma y Postgres
      Sentry.amqplibIntegration(),
      Sentry.prismaIntegration(),
      Sentry.postgresIntegration(),

      SentryProfiling.nodeProfilingIntegration(),
      Sentry.consoleLoggingIntegration({
        levels: ["log", "warn", "error", "info"],
      }),
    ],
    tracesSampleRate: 0.1, // 1.0 = 100% de las transacciones (bajar en producción)
    tracePropagationTargets: ["localhost"],
    profilesSampleRate: 0.1,
    enableLogs: true,

  });
  app.use(Sentry.expressErrorHandler());

  // Errores no capturados
  // process.on("uncaughtException", (err) => {
  //   Sentry.captureException(err);
  //   console.error("Uncaught Exception:", err);
  // });

  process.on("unhandledRejection", (reason) => {
    Sentry.captureException(reason);
    console.error("Unhandled Rejection:", reason);
  });
}
