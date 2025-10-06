import { appEvents } from "../../events/appEvents";
import { SocketUser, ThumbnailCompletedPayload } from "../types";

export default class SystemEmitterHandler {        
    constructor(){}
    initialize(socket:SocketUser){        
        socket.on("system:thumbnailCompleted",(data)=>this.handleThumbnailCompleted(data))
    }    
    
    public async handleThumbnailCompleted(data:ThumbnailCompletedPayload){

        appEvents.emit("thumbnail:completed",data)
    }
    public async handleThumbnailError(){

    }
}