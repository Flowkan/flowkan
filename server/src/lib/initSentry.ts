import * as Sentry from "@sentry/node";
import * as SentryProfiling from "@sentry/profiling-node";
import express from "express";

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
        levels: ["error"],
      }),
    ],
    environment: ENV,
    tracesSampleRate: ENV === "production" ? 0.1 : 1.0, // 1.0 = 100% de las transacciones (bajar en producción)
    profilesSampleRate: 0.1,
    enabled: isProduction,
    enableLogs: false,
  });
  app.use(Sentry.expressErrorHandler());

  // Errores no capturados

  process.on("unhandledRejection", (reason) => {
    Sentry.captureException(reason);
    console.error("Unhandled Rejection:", reason);
  });
}
