import * as amqplib from "amqplib";
import { RABBITMQ_URL, Topology } from "./config";

let connection: amqplib.ChannelModel | null = null;
let channel: amqplib.Channel | null = null;

function registerErrorHandlers() {
  if (connection) {
    // Manejar errores en la conexión
    connection.on("error", (err) => {
      console.error("[Broker Error] La conexión ha fallado:", err);
      // Salir forzosamente para que el proceso sea reiniciado
      process.exit(1);
    });

    // Manejar cierres inesperados de la conexión
    connection.on("close", () => {
      console.error(
        "[Broker Close] La conexión ha sido cerrada inesperadamente.",
      );
      process.exit(1);
    });
  }

  if (channel) {
    // Manejar errores en el canal
    channel.on("error", (err) => {
      console.error("[Channel Error] El canal ha fallado:", err);
    });
  }
}

export async function setupBroker(): Promise<amqplib.Channel> {
  if (channel) {
    return channel;
  }
  try {
    connection = await amqplib.connect(RABBITMQ_URL);

    channel = await connection.createChannel();

    for (const exchange of Topology.exchanges) {
      await channel.assertExchange(
        exchange.name,
        exchange.type,
        exchange.options,
      );
    }

    for (const queue of Topology.queues) {
      await channel.assertQueue(queue.name, queue.options);
    }

    //Crear Bindings
    for (const binding of Topology.bindings) {
      await channel.bindQueue(
        binding.queue,
        binding.exchange,
        binding.routingKey,
      );
    }

    registerErrorHandlers();

    return channel as amqplib.Channel;
  } catch (error) {
    console.error(`[Broker] Error al conectar con RabbitMQ`, error);
    throw error;
  }
}

export async function closeBroker(): Promise<void> {
  if (channel) {
    channel = null;
  }
  if (connection) {
    await connection.close();
    connection = null;
  }
}
