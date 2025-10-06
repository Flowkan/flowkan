import { ThumbnailCompletedPayload, ThumbnailErrorPayload } from "../../sockets/types";
import { socketClientFromWorker } from "./connectionManager";

type SocketClientType = typeof socketClientFromWorker;
export default class WorkerSocketEvents {
    constructor(private readonly socketClient:SocketClientType,private readonly userId:number){
        socketClient.auth= {
            userId:this.userId
        }
        socketClient.connect()
    }    
    emitThumbnailCompleted(payload:ThumbnailCompletedPayload){
        this.socketClient.emit("system:thumbnailCompleted",payload)
        console.log(`[Worker Socket] Emitiendo --> system:thumbnailCompleted for`,payload);        
    }
    emitThumbnailError(payload:ThumbnailErrorPayload){

    }
}