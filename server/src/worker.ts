import * as amqplib from 'amqplib'
import { closeBroker, setupBroker } from './broker/connection';
import { startEmailConsumer } from './broker/consumers/emailConsumer';
import { startThumbnailConsumer } from './broker/consumers/thumbnailConsumer';
async function startWorker(){
    let channel:amqplib.Channel;
    try {
        channel = await setupBroker()

        console.log("--- WORKER INICIANDO: Escuchando tareas ---")

        startEmailConsumer(channel)

        startThumbnailConsumer(channel)

        console.log("Worker activo, esperando nuevos mensajes...");
        

    } catch (error) {
        console.error("Fallo crítico al iniciar el Worker:",error);
        process.exit(1)
    }
}

function handleShutdown(signal:NodeJS.Signals){
    console.log(`\n[Worker] Señal ${signal} recibida. Cerrando`)
    closeBroker()
        .then(()=>process.exit(0))
        .catch(err=> {
            console.error("[Worker] Error al cerrar el broker",err)
            process.exit(1)
        })
}

process.on("SIGINT",handleShutdown)
process.on("SIGTERM",handleShutdown)

startWorker()