import * as amqplib from 'amqplib'
import { setupBroker } from '../connection';
import { Exchanges } from '../config';

interface EmailPayload {
    to:string;
    subject:string;
    body:string;
}

export async function sendEmailTask(payload:EmailPayload){
    let channel:amqplib.Channel;
    try {
        channel = await setupBroker()
        const message = JSON.stringify(payload)
        const buffer = Buffer.from(message)

        const exchangeName = Exchanges.TASK_EXCHANGE;
        
        const sent = channel.publish(
            exchangeName,
            '*',
            buffer,
            { persistent:true }
        )
        console.log(message);        
        if(sent){
            console.log(`[Producer: Email] Mensaje enviado`);
            return true            
        }else{
            console.log(`[Producer: Email] Mensaje NO enviado, buffer lleno o error`);
            
            return false
        }
    } catch (error) {
        
    }
}