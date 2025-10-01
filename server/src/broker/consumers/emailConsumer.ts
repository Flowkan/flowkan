import * as amqplib from "amqplib";
import { Queues } from "../config";
import { generateWelcomeEmailTemplate } from "../../services/TemplateEmailService";
import { sendEmail } from "../../lib/emailService";

interface EmailPayload {
    to: string;
    subject: string;
    // 💡 NUEVO: Campo que define el tipo de acción
    type: 'CONFIRMATION' | 'PASSWORD_RESET' | 'WELCOME' | 'GENERIC'; 
    
    // 💡 Datos específicos requeridos por el tipo (ej. un token o URL)
    data: {
        token?: string; 
        url?: string;
        username?: string;
        // ... otros campos necesarios
    };
}

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
    //Enviar emial
    await sendMailService(emailPayload)
    channel.ack(payload);
    console.log(`[Consume: Email] Tarea completada y ACK enviado`);
  } catch (error) {
    console.error(`[Consume: Email] Fallo de procesamineto. Enviado a DLQ`);
    channel.nack(payload, false, false);
  }
}


export async function sendMailService(payload: EmailPayload): Promise<void> {
    let emailContent: { subject: string, html: string };

    // 💡 Switch/Case basado en el tipo de acción
    switch (payload.type) {
        case 'CONFIRMATION':
            emailContent = {
                subject: 'Confirma tu dirección de correo electrónico',
                html: generateWelcomeEmailTemplate(payload.data.url, payload.data.token), 
            };
            break;

        case 'PASSWORD_RESET':
            emailContent = {
                subject: 'Restablece tu Contraseña',
                html: generateWelcomeEmailTemplate(payload.data.url, payload.data.token),
            };
            break;
            
        case 'WELCOME':
        default:
             emailContent = {
                subject: 'Bienvenido a nuestra plataforma',
                html: generateWelcomeEmailTemplate(payload.data.username),
            };
            break;
    }
    
    await sendEmail(payload.to,emailContent.subject,emailContent.html)
    console.log(`[EmailService] Correo tipo ${payload.type} enviado a ${payload.to}.`);
}

