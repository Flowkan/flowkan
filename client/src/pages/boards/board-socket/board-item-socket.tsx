import { useEffect, useState, type ReactNode } from "react";
import { BoardItemSocketContext } from "./context";
import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../hooks/socket/context";
import { useAppSelector } from "../../../store";
import { getCurrentBoard } from "../../../store/selectors";
import { useLastPointer } from "./useLastPointer";


interface BoardItemSocketProps {
    children:ReactNode;
}

const BoardItemSocket = ({children}:BoardItemSocketProps) => {    
    const { boardId } = useParams<{ boardId: string }>();
    const socket = useSocket();
    const board = useAppSelector(getCurrentBoard)    
    
    const [isDragging,setIsDragging] = useState(false)
    const [remoteDrag, setRemoteDrag] = useState<null | {
    userId: string;
    name: string;
    taskName:string;
    draggableId: string;
    coords?: { xNorm: number; yNorm: number };
    destination?: { droppableId: string; index: number };
    }>(null);
    const [tasklock,setTaskLock] = useState<string|null>(null)


    //Coords Ref
    const lastPointerRef = useLastPointer()

    function handleDragStart(start:DragStart){
        const coords = lastPointerRef.current;
        const x = coords ? coords.x / window.innerWidth : 0;
        const y = coords ? coords.y / window.innerHeight : 0;
        
        if(boardId && board){            
            const { draggableId,source:{droppableId} } = start
            const column = board.lists.find(col => Number(col.id) === Number(droppableId) )
            if(!column)return
            const task = column!.cards.find(card => Number(card.id) === Number(draggableId))
            if(!task)return 
            
            socket.emit('board:dragstart',{start,board,task,x,y})
            setIsDragging(true)
            
        }
    };

    function handleDragUpdate(update:DragUpdate){
        socket.emit('board:dragupdate',{
            update
        })    
    };
   
    function handleDragEnd(result:DropResult){
        setIsDragging(false)
        socket.emit('board:dragend',{result})                
    };
    
    const values = {
        remoteDrag,
        handleDragStart,
        handleDragUpdate,
        handleDragEnd
    }
    useEffect(()=>{
        socket.on('board:dragstarted',(payload)=>{			
            if(payload){
                const { start,userId,name,task } = payload                
                setRemoteDrag({
                    userId,
                    name,
                    taskName:task.title,
                    draggableId:(start as DragStart).draggableId
                })
                
            }
		})   
        socket.on('board:dragshowcoords',({x,y})=>{
            if(remoteDrag?.userId && remoteDrag.draggableId){
                setRemoteDrag({
                    ...remoteDrag,
                    coords:{
                        xNorm:x,
                        yNorm:y
                    }
                })
            }
        })   
        socket.on('board:dragupdated',({update})=>{                        
            if(remoteDrag && update){
                const { destination } = (update as DragUpdate)
                if(!destination)return                
                setRemoteDrag({
                    ...remoteDrag,
                    draggableId:(update as DragUpdate).draggableId,
                    destination:{
                        droppableId:destination.droppableId,
                        index:destination.index
                    } 
                })
            }          
        })
        socket.on('board:dragend',(payload)=>{
            console.log(payload);
            setRemoteDrag(null)
        })
        socket.on("board:dragfailed",(payload)=>{
            const { draggableId } = payload
            if(draggableId){
                setTaskLock(draggableId)
            }
        })
    },[socket,remoteDrag])

    //Pasar movimientos de arrastre
    useEffect(()=>{
        const handleMouseMove = (e:MouseEvent) => {
            if(!isDragging)return
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            socket.emit("board:dragsendcoords",{
                x,y
            })
        }
        window.addEventListener("mousemove",handleMouseMove)
        return () => window.removeEventListener("mousemove",handleMouseMove)
    },[socket,isDragging])
    return (
        <BoardItemSocketContext.Provider value={values}>
            {children}
        </BoardItemSocketContext.Provider>
    );


};

export default BoardItemSocket;
