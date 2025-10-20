import * as amqplib from "amqplib";
import { closeBroker, setupBroker } from "./broker/connection";
import { startEmailConsumer } from "./broker/consumers/emailConsumer";
import { startThumbnailConsumer } from "./broker/consumers/thumbnailConsumer";
import * as Sentry from "@sentry/node";
async function startWorker() {
  let channel: amqplib.Channel;
  try {
    channel = await setupBroker();

    startEmailConsumer(channel);

    startThumbnailConsumer(channel);
  } catch (error) {
    Sentry.captureException(error);
    console.error("Fallo crítico al iniciar el Worker:", error);
    process.exit(1);
  }
}

function handleShutdown(signal: NodeJS.Signals) {
  closeBroker()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Worker] Error al cerrar el broker", err);
      process.exit(1);
    });
}

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

startWorker();
