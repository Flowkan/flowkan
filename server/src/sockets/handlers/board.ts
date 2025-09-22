import { Server, Socket } from "socket.io";
import { ServerBoard, SocketBoard } from "../types";
import { Board } from "@prisma/client";
import { BoardWithRelations } from "../../models/BoardModel";

export default class BoardHandler {
    private columns = []
    private task = {}
    constructor(
        private io:ServerBoard
    ){}
    initialize(socket:SocketBoard){
        socket.on("board:dragstart",({start,board,x,y})=>this.handleDragStart(socket,{start,board,x,y}))
        socket.on("board:dragsendcoords",({x,y})=>this.handleDragCatchCoords(socket,{x,y}))
        socket.on("board:dragupdate",({update})=>this.handleUpdate(socket,update))
    }

    private handleDragStart(socket:SocketBoard,payload:{start:unknown,board:BoardWithRelations,x:number,y:number}){
        const { start,board,x,y } = payload        
        console.log(start);        
        if(!socket.data.room)return
        socket.to(socket.data.room).emit('board:dragstarted',{
            userId:String(socket.data?.user?.id),
            start,
            board,
            x,y
        })
    }

    private handleDragCatchCoords(socket:SocketBoard,payload:{x:number,y:number}){
        if(!socket.data.room)return
        const { x,y } = payload
        socket.to(socket.data.room).emit("board:dragshowcoords",{
            x,y
        })
    }
    private handleUpdate(socket:SocketBoard,update:unknown){
        if(!socket.data.room)return
        socket.to(socket.data.room).emit("board:dragupdated",{
            update
        })
    }
}

 