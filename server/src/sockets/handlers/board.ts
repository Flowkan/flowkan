import { Server, Socket } from "socket.io";
import { DragStart, ServerBoard, SocketBoard, Task } from "../types";
import { Board } from "@prisma/client";
import { BoardWithRelations } from "../../models/BoardModel";

export default class BoardHandler {
    private locks = new Map<string,string>();
    constructor(
        private io:ServerBoard
    ){}
    initialize(socket:SocketBoard){
        socket.on("board:dragstart",({start,board,task,x,y})=>this.handleDragStart(socket,{start,board,task,x,y}))
        socket.on("board:dragsendcoords",({x,y})=>this.handleDragCatchCoords(socket,{x,y}))
        socket.on("board:dragupdate",({update})=>this.handleUpdate(socket,update))
        socket.on("board:dragend",({result})=>this.handleDragEnd(socket,result))        
    }

    private handleDragStart(socket:SocketBoard,payload:{start:unknown,board:BoardWithRelations,task:Task,x:number,y:number}){
        const { start,board,task,x,y } = payload        
        console.log(start);        
        if(!socket.data.room)return
        const { draggableId } = start as DragStart
        // if(!draggableId)return
        // if(this.locks.has(draggableId)){
        //     socket.to(socket.data.room).emit('board:dragfailed',{
        //         draggableId
        //     })
        //     return
        // }
        const userId = socket.data.user?.id
        if(!userId)return
        this.locks.set(draggableId,String(userId))
        socket.to(socket.data.room).emit('board:dragstarted',{
            userId:String(userId),
            name:String(socket.data?.user?.name),
            start,
            board,
            task,
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
        // console.log(update);        
        if(!socket.data.room)return
        socket.to(socket.data.room).emit("board:dragupdated",{
            update
        })
    }
    private handleDragEnd(socket:SocketBoard,result:unknown){
        if(!socket.data.room)return
        this.locks.clear()
        socket.to(socket.data.room).emit("board:dragend",{
            result
        })
    }
}
