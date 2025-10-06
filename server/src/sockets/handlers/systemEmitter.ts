import { appEvents } from "../../events/appEvents";
import { ServerUser, SocketUser, ThumbnailCompletedPayload } from "../types";

export default class SystemEmitterHandler {    
    // constructor(private readonly io: ServerUser) {}
    constructor(){}
    initialize(socket:SocketUser){        
        socket.on("system:thumbnailCompleted",(data)=>this.handleThumbnailCompleted(data))
    }    
    public async handleThumbnailLoaded(socket:SocketUser){
        // if(!socket.data.userId){
        //     socket.emit("system:thumbnailError")
        //     return;
        // };
                
        // console.log('[Socket on Worker] Iniciando emision de thumbnail:loaded');
        
    }
    public async handleThumbnailCompleted(data:ThumbnailCompletedPayload){
        // this.io.to(String(data.userId)).emit("system:thumbnailCompleted",{
        //     thumbPath:data.thumbPath
        // })
        appEvents.emit("thumbnail:completed",data)
    }
    public async handleThumbnailError(){

    }
}