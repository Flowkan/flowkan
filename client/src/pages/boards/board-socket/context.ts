import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import { createContext, useContext } from "react";

export const BoardItemSocketContext = createContext<{
    remoteDrag:{
    userId: string;
    name:string;
    taskName:string;
    draggableId: string;
    coords?: { xNorm: number; yNorm: number };
    destination?: { droppableId: string; index: number };
    }|null;
    handleDragStart:(start:DragStart)=>void;
    handleDragUpdate:(update:DragUpdate)=>void;
    handleDragEnd:(result:DropResult)=>void;
}>({
    remoteDrag:null,
    handleDragEnd:()=>{},
    handleDragStart:()=>{},
    handleDragUpdate:()=>{}
})

export function useBoardItemSocket(){
    const ctx = useContext(BoardItemSocketContext)
    return ctx
}