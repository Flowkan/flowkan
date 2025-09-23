import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import { createContext, useContext, type RefObject } from "react";

export const BoardItemSocketContext = createContext<{
    tasklock:string|null;
    itemDrag:RefObject<HTMLDivElement|null>|null;
    remoteDrag:{
    userId: string;
    name:string;
    taskName:string;
    draggableId: string;
    source:{ droppableId: string, index: number };
    coords?: { xNorm: number; yNorm: number };
    destination?: { droppableId: string; index: number };
    }|null;
    handleDragStart:(start:DragStart)=>void;
    handleDragUpdate:(update:DragUpdate)=>void;
    handleDragEnd:(result:DropResult)=>void;
}>({
    tasklock:null,
    itemDrag:null,
    remoteDrag:null,
    handleDragEnd:()=>{},
    handleDragStart:()=>{},
    handleDragUpdate:()=>{}
})

export function useBoardItemSocket(){
    const ctx = useContext(BoardItemSocketContext)
    return ctx
}