import * as amqplib from "amqplib";
import { Queues } from "../config";
import {
  generateConfirmationEmailTemplate,
  generateGoodbyeEmailTemplate,
  generatePasswordResetEmailTemplate,
  generateWelcomeEmailTemplate,
} from "../../services/TemplateEmailService";
import { sendEmail } from "../../lib/emailService";
import { DataUser, EmailPayload } from "../types";
import * as Sentry from "@sentry/node";

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
    Sentry.withScope((scope) => {
      scope.setExtra("queue", Queues.EMAIL_QUEUE);
      if (emailPayload) {
        scope.setExtra("type", emailPayload.type);
        scope.setUser({ email: emailPayload.to });
      }
      Sentry.captureException(error);
    });
    console.error(
      `[Consume: Email] Fallo de procesamineto. Enviado a DLQ`,
      error,
    );
    channel.nack(payload, false, false);
  }
}

const EMAIL_CONFIGS = {
  CONFIRMATION: {
    es: "Confirma tu dirección de correo electrónico",
    en: "Confirm your email address",
    getData: (data: DataUser) => ({
      name: data.name!,
      url: data.url!,
      token: data.token!,
    }),
    getHtml: (data: DataUser, lang: string) =>
      generateConfirmationEmailTemplate(
        data.name!,
        data.url!,
        data.token!,
        lang,
      ),
  },
  PASSWORD_RESET: {
    es: "Restablece tu Contraseña",
    en: "Reset Your Password",
    getData: (data: DataUser) => ({ url: data.url!, token: data.token! }),
    getHtml: (data: DataUser, lang: string) =>
      generatePasswordResetEmailTemplate(data.url!, data.token!, lang),
  },
  GOODBYE: {
    es: "Lamentamos verte partir",
    en: "We're sorry to see you go",
    getData: (data: DataUser) => ({ name: data.name!, url: data.url! }),
    getHtml: (data: DataUser, lang: string) =>
      generateGoodbyeEmailTemplate(data.name!, data.url!, lang),
  },
  WELCOME: {
    es: "Bienvenido a nuestra plataforma",
    en: "Welcome to our platform",
    getData: (data: DataUser) => ({ name: data.name!, url: data.url! }),
    getHtml: (data: DataUser, lang: string) =>
      generateWelcomeEmailTemplate(data.url!, data.name, lang),
  },
  GENERIC: {
    es: "Bienvenido a nuestra plataforma",
    en: "Welcome to our platform",
    getData: (data: DataUser) => ({ name: data.name! }),
    getHtml: (data: DataUser, lang: string) =>
      generateWelcomeEmailTemplate(data.url!, data.name, lang),
  },
};

export async function sendMailService(payload: EmailPayload): Promise<void> {
  const { type, data, language: lang = "es" } = payload;
  const config = EMAIL_CONFIGS[type] || EMAIL_CONFIGS.WELCOME;
  const emailData = config.getData(data!);
  const subject = lang === "es" ? config.es : config.en;
  const html = await config.getHtml(emailData, lang);
  await sendEmail(payload.to, subject, html);
}
