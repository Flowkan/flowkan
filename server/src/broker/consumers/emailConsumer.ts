import * as amqplib from "amqplib";
import { Queues } from "../config";
import {
  generateConfirmationEmailTemplate,
  generatePasswordResetEmailTemplate,
  generateWelcomeEmailTemplate,
} from "../../services/TemplateEmailService";
import { sendEmail } from "../../lib/emailService";
import { dataUser, EmailPayload } from "../types";

export async function startEmailConsumer(channel: amqplib.Channel) {
  const queueName = Queues.EMAIL_QUEUE;

  await channel.assertQueue(queueName, { durable: true });

  channel.consume(
    queueName,
    (message) => {
      if (message) {
        processEmailMessage(channel, message);
      }
    },
    { noAck: false },
  );
}

async function processEmailMessage(
  channel: amqplib.Channel,
  payload: amqplib.ConsumeMessage,
) {
  let emailPayload: EmailPayload | null = null;
  try {
    const payloadContent = payload.content.toString();
    emailPayload = JSON.parse(payloadContent) as EmailPayload;
    //Envio de email
    await sendMailService(emailPayload);
    channel.ack(payload);
  } catch (error) {
    console.error(
      `[Consume: Email] Fallo de procesamineto. Enviado a DLQ`,
      error,
    );
    channel.nack(payload, false, false);
  }
}

export async function sendMailService(payload: EmailPayload): Promise<void> {
  let emailContent: { subject: string; html: string };

  switch (payload.type) {
    case "CONFIRMATION": {
      const { name, url, token } = payload.data as dataUser;
      emailContent = {
        subject: "Confirma tu dirección de correo electrónico",
        html: await generateConfirmationEmailTemplate(name!, url!, token!),
      };
      break;
    }
    case "PASSWORD_RESET": {
      const { url, token } = payload.data as dataUser;
      emailContent = {
        subject: "Restablece tu Contraseña",
        html: await generatePasswordResetEmailTemplate(url!, token!),
      };
      break;
    }
    case "WELCOME":
    default:
      const { name, url } = payload.data as dataUser;
      emailContent = {
        subject: "Bienvenido a nuestra plataforma",
        html: await generateWelcomeEmailTemplate(url!, name),
      };
      break;
  }
  await sendEmail(payload.to, emailContent.subject, emailContent.html);
}
