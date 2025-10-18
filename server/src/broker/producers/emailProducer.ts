import * as amqplib from "amqplib";
import { setupBroker } from "../connection";
import { Exchanges, RoutingKeys } from "../config";
import { EmailPayload } from "../types";
import * as Sentry from "@sentry/node";

export async function sendEmailTask(payload: EmailPayload) {
  const channel = await setupBroker();
  const message = JSON.stringify(payload);
  const buffer = Buffer.from(message);

  const exchangeName = Exchanges.TASK_EXCHANGE;
  const routingKey = RoutingKeys.EMAIL_SEND;

  //Publica el mensaje en la cola
  let sent = channel.publish(exchangeName, routingKey, buffer, {
    persistent: true,
  });
  if (sent) {
    return true;
  }

  try {
    await new Promise((resolve) => {
      channel.once("drain", resolve);
    });
    sent = channel.publish(exchangeName, routingKey, buffer, {
      persistent: true,
    });
    if (sent) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    Sentry.withScope((scope) => {
      scope.setExtra("exchangeName", exchangeName);
      scope.setExtra("routingKey", routingKey);
      scope.setExtra("type", payload.type);
      if (payload.to) {
        scope.setUser({ email: payload.to });
      }
      Sentry.captureException(error);
    });
    console.error(
      `[Producer: Email] Error grave durante la publicación`,
      error,
    );
    return false;
  }
}
