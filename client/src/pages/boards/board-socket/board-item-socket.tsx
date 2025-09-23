import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoardItemSocketContext } from "./context";
import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../hooks/socket/context";
import { useAppSelector } from "../../../store";
import { getCurrentBoard } from "../../../store/selectors";
import { usePointerItemDrag } from "./useLastPointerItemDrag";


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
    source:{ droppableId: string, index: number }
    coords?: { xNorm: number; yNorm: number };    
    destination?: { droppableId: string; index: number };
    }>(null);
    const [tasklock,setTaskLock] = useState<string|null>(null)
    const itemDrag = useRef<HTMLDivElement|null>(null)


    //Coords Ref
    const coordsItemDrag = usePointerItemDrag(itemDrag)

    function handleDragStart(start:DragStart){
        // const coords = lastPointerRef.current;
        // const x = coords ? coords.x / window.innerWidth : 0;
        // const y = coords ? coords.y / window.innerHeight : 0;
        
        const x = coordsItemDrag.current ? coordsItemDrag.current.x : 0 // / window.innerWidth : 0;
        const y = coordsItemDrag.current ? coordsItemDrag.current.y : 0// / window.innerHeight : 0;

        // console.log(x,y);
        
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
        tasklock,
        itemDrag,
        remoteDrag,
        handleDragStart,
        handleDragUpdate,
        handleDragEnd
    }
    useEffect(()=>{
        socket.on('board:dragstarted',(payload)=>{			
            if(payload){
                const { start,userId,name,task } = payload 
                if(!start)return
                const { draggableId,source } = start as DragStart               
                setRemoteDrag({
                    userId,
                    name,
                    taskName:task.title,
                    draggableId,
                    source
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
        socket.on('board:dragend',(/*payload*/)=>{
            // console.log(payload);
            setRemoteDrag(null)
        })
        socket.on("board:dragfailed",(payload)=>{
            const { draggableId } = payload
            if(draggableId){
                // console.log(draggableId);
                
                setTaskLock(draggableId)
            }
        })
    },[socket,remoteDrag])

    //Pasar movimientos de arrastre
    useEffect(()=>{
        const handleMouseMove = () => {
            if(!isDragging)return
            if(!itemDrag.current)return
            const item = itemDrag.current
            const rect = item.getBoundingClientRect()
            const x = rect.left//e.clientX / window.innerWidth;
            const y = rect.top//e.clientY / window.innerHeight;
            socket.emit("board:dragsendcoords",{
                x,y
            })
        }
        window.addEventListener("mousemove",handleMouseMove)
        return () => window.removeEventListener("mousemove",handleMouseMove)
    },[socket,isDragging])

  

    
    
    // useEffect(()=>{        
        // if(isDragging){            
        // }
        // const h = () => {
        //     if(isDragging && itemDrag.current){
        //         console.log(itemDrag.current.getBoundingClientRect().left);            
        //     }
        // }
        // document.addEventListener('mousemove',h)
        // if(isDragging){
        //     console.log(coordsItemDrag.current);
            
        // }
    // },[isDragging,coordsItemDrag])
    return (
        <BoardItemSocketContext.Provider value={values}>
            {children}
        </BoardItemSocketContext.Provider>
    );


};

export default BoardItemSocket;
