import * as amqplib from "amqplib";
import { setupBroker } from "../connection";
import { Exchanges, RoutingKeys } from "../config";

// interface EmailPayload {
//   to: string;
//   subject: string;
//   body: string;
// }

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
      console.log(`[Producer: Email] Mensaje enviado`);
      return true;
    }
    console.warn(`[Producer: Email] Buffer, esperando para reintentar`);

    try {
      await new Promise((resolve) => {
        channel.once("drain", resolve);
      });
      sent = channel.publish(exchangeName, routingKey, buffer, {
        persistent: true,
      });
      if(sent){
        console.log(`[Producer: Email] Mensaje enviado`);
        return true        
      }else{
        console.log(`[Producer: Email] Fallo en el reenvio`);
        return false        
      }
    } catch (error) {
        console.error(`[Producer: Email] Error grave durante la publicación`,error);
        return false        
    }
    
}
