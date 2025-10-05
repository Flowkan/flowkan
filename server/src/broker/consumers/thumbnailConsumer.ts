import * as amqplib from "amqplib";
import { Queues } from "../config";
import { MakeThumbnailPayload } from "../types";
import sharp from "sharp";
import { socketClientFromWorker } from "../client-socket/connectionManager";
import WorkerSocketEvents from "../client-socket/workerSocketEvents";

export async function startThumbnailConsumer(channel: amqplib.Channel) {
  const queueName = Queues.THUMBNAIL_QUEUE;

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(
    queueName,
    (message) => {
      if (message) {
        //Consumir el mensaje
        processThumbnailMessage(channel, message);
      }
    },
    { noAck: false },
  );
}

async function processThumbnailMessage(
  channel: amqplib.Channel,
  payload: amqplib.ConsumeMessage,
) {
  let thumbnailPayload: MakeThumbnailPayload | null = null;
  try {
    const payloadContent = payload.content.toString();
    thumbnailPayload = JSON.parse(payloadContent) as MakeThumbnailPayload;
    //Loaded Thumbnail
    const socketEvent = new WorkerSocketEvents(socketClientFromWorker,thumbnailPayload.userId)
    // socketEvent.handleTest()
    // Generación de thumbnail y guarado en base de datos        
    await makeThumbnailService(thumbnailPayload)
    socketEvent.emitThumbnailCompleted({
      userId: thumbnailPayload.userId,
      originalPath: thumbnailPayload.originalPath,
      thumbPath: thumbnailPayload.thumbPath,
    })
    channel.ack(payload);
    console.log(`[Consume: Thumbnail] Tarea completada y ACK enviado`);
  } catch (error) {
    console.error(
      `[Consume: Thumbnail] Fallo de procesamineto. Enviado a DLQ`,
      error,
    );
    channel.nack(payload, false, false);
  }
}

async function makeThumbnailService(
  payload: MakeThumbnailPayload,
): Promise<void> {
  const { originalPath, thumbPath, thumbSize } = payload;
  // const imageBuffer = fs.readFileSync(originalPath)
  const sizes = thumbSize ? thumbSize : { width: 200, height: 200 };
  try {
    // thumbnail
    await sharp(originalPath)
      .resize(sizes)
      .webp({ quality: 80 })
      .toFile(thumbPath);
  } catch (error) {
    throw error;
  }
}
