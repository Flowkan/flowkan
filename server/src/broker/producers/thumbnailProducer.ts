import { Exchanges, RoutingKeys } from "../config";
import { setupBroker } from "../connection";
import { MakeThumbnailPayload } from "../types";

export async function sendToMakeThumbnailTask(payload: MakeThumbnailPayload) {
  
    const channel = await setupBroker();
    const message = JSON.stringify(payload);
    const buffer = Buffer.from(message);

    const exchangeName = Exchanges.TASK_EXCHANGE;
    const routingKey = RoutingKeys.THUMBNAIL_GENERATE;

    let sent = channel.publish(exchangeName, routingKey, buffer, {
      persistent: true,
    });
    if (sent) {
      console.log(`[Producer: Thumbnail] Mensaje enviado`);
      return true;
    }
    console.warn(`[Producer: Thumbnail] Buffer, esperando para reintentar`);

    try {
      await new Promise((resolve) => {
        channel.once("drain", resolve);
      });
      sent = channel.publish(exchangeName, routingKey, buffer, {
        persistent: true,
      });
      if(sent){
        console.log(`[Producer: Thumbnail] Mensaje enviado`);
        return true        
      }else{
        console.log(`[Producer: Thumbnail] Fallo en el reenvio`);
        return false        
      }
    } catch (error) {
        console.error(`[Producer: Thumbnail] Error grave durante la publicación`,error);
        return false        
    }
    
}