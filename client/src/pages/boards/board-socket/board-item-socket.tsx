import { useCallback, useEffect, useState, type ReactNode } from "react";
import { BoardItemSocketContext } from "./context";
import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
// import { socket } from "../../../socket";
import { useParams } from "react-router-dom";
import { useSocket } from "../../../hooks/socket/context";
import { useAppSelector } from "../../../store";
import { getCurrentBoard } from "../../../store/selectors";
import { useLastPointer } from "./useLastPointer";


interface BoardItemSocketProps {
    children:ReactNode;
}

const BoardItemSocket = ({children}:BoardItemSocketProps) => {
    // const [boardId,setBoardId] = useState('');
    const { boardId } = useParams<{ boardId: string }>();
    const socket = useSocket();
    const board = useAppSelector(getCurrentBoard)
    const [startDrag,setStartDrag] = useState<DragStart|null>(null)
    const [itemDrag,setItem]=useState('');
    
    const [isDragging,setIsDragging] = useState(false)
    const [remoteDrag, setRemoteDrag] = useState<null | {
    userId: string;
    draggableId: string;
    coords?: { xNorm: number; yNorm: number };
    destination?: { droppableId: string; index: number };
    }>(null);

    //Cords
    const lastPointerRef = useLastPointer()

    function handleDragStart(start:DragStart){
        const coords = lastPointerRef.current;
        const x = coords ? coords.x / window.innerWidth : 0;
        const y = coords ? coords.y / window.innerHeight : 0;
        // console.log(start);
        if(boardId && board){
            socket.emit('board:dragstart',{start,board,x,y})
            setIsDragging(true)
            const { draggableId,source:{droppableId} } = start
            const column = board.lists.find(col => Number(col.id) === Number(droppableId) )
            if(!column)return
            const task = column!.cards.find(card => Number(card.id) === Number(draggableId))
            if(!task)return
            // console.log(task);
            
            
        }
    };

    function handleDragUpdate(update:DragUpdate){
        socket.emit('board:dragupdate',{
            update
        })    
    };
    // const handleDragUpdate = useCallback((update:DragUpdate)=>{
    //     socket.emit('board:dragupdate',{
    //         update
    //     })
    // },[socket])
    function handleDragEnd(result:DropResult){
        setIsDragging(false)
        // console.log(result);        
    };
    
    const values = {
        remoteDrag,
        handleDragStart,
        handleDragUpdate,
        handleDragEnd
    }
    useEffect(()=>{
        socket.on('board:dragstarted',(payload)=>{
			// console.log(payload);
            if(payload){
                const { start,userId } = payload
                setRemoteDrag({
                    userId,
                    draggableId:(start as DragStart).draggableId
                })
            }
		})   
        socket.on('board:dragshowcoords',({x,y})=>{
            // console.log(payload);
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
    },[isDragging])
    return (
        <BoardItemSocketContext.Provider value={values}>
            {children}
        </BoardItemSocketContext.Provider>
    );


};

export default BoardItemSocket;
