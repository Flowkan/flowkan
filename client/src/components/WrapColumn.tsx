import React, { useMemo, useRef } from "react";
import type { Task } from "../pages/boards/types";
import TaskCard from "./TaskCard";
import type {
	DroppableProvided,
	DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";

type placeholder = {id:string,isPlaceholder:boolean}
type taskWithPlaceholder = (placeholder|Task)[]

interface WrapColumnProps {
	cards: Task[];
	columnId: string;
	provided: DroppableProvided;
	snapshot: DroppableStateSnapshot;	
	onEditTask: (updatedFields: { title?: string; description?: string }) => void;
	onDeleteTask: (taskId: string, columnId: string) => void;	
	onOpenTaskDetail: (task: Task, columnId: string) => void;
	
}
const WrapColumn = ({
	cards,
	columnId,
	provided,
	snapshot,
	onEditTask,
	onDeleteTask,
	onOpenTaskDetail,
}: WrapColumnProps) => {
	const { remoteDrag } = useBoardItemSocket();
	const setRefs = (el: HTMLDivElement | null) => {
		provided.innerRef(el);
		columnRef.current = el;
	};
	const columnRef = useRef<HTMLDivElement | null>(null);
	// let widthGhost:number = 0;
	const widthGhost = useRef(0);
	if (columnRef.current) {
		widthGhost.current = columnRef.current.clientWidth;
	}
	const items = useMemo(() => {
		if (
			remoteDrag &&
			remoteDrag.destination?.droppableId === columnId &&
			remoteDrag.destination.index >= 0
		) {
			const clone:taskWithPlaceholder = [...cards];
			clone.splice(remoteDrag.destination.index, 0, {
				id: "remote-placeholder",
				isPlaceholder: true,
			});
			return clone;
		}
		return cards;
	}, [cards, remoteDrag, columnId]);
	return (
		<div
			// ref={provided.innerRef}
			ref={setRefs}
			{...provided.droppableProps}
			className={`min-h-[50px] flex-grow rounded-md p-2 transition-colors duration-200 ${
				snapshot.isDraggingOver ? "bg-background-hover-column" : ""
			} custom-scrollbar overflow-y-auto`}
		>
			{/* {(column.cards ?? []).map((item: Task, index: number) => { */}
			{items.map((item, index: number) => {
				// const isPlaceholder = remotePlaceholderIndex === index

				return (
					<>						
						{"isPlaceholder" in item && item.isPlaceholder ? (
							<div
								key={`remote-placeholder-${index}`}
								style={{
									height: "80px", 
									backgroundColor: "transparent",
								}}
							/>
						) : (
							<TaskCard
								key={item.id}
								task={item as Task}
								index={index}
								columnId={String(columnId)}
								onEditTask={(updatedFields) => onEditTask(updatedFields)}
								onDeleteTask={onDeleteTask}
								onOpenTaskDetail={onOpenTaskDetail}
							/>
						)}
					</>
				);
			})}
			{/* Ghost remoto flotando */}
			{remoteDrag?.coords && (
				<div
					style={{
						top: remoteDrag.coords.yNorm, //* window.innerHeight,
						left: remoteDrag.coords.xNorm, //* window.innerWidth - (remoteDrag.coords.xNorm - widthGhost),
						width: `${widthGhost.current > 0 ? widthGhost.current - 16 : 0}px`,
						maxWidth: `${widthGhost.current > 0 ? widthGhost.current - 16 : 0}px`,
					}}
					className="text-text-body bg-accent-lightest ring-accent-light pointer-events-none fixed mb-3 flex cursor-pointer flex-col rounded-md border-2 bg-amber-50 p-4 shadow-lg ring-2 transition-all duration-200 ease-in-out"
				>
					<span className="bg-accent absolute -top-2 -left-2 rounded-2xl px-2 text-xs text-white">
						{remoteDrag.name}
					</span>
					<span className="text-text-heading mb-2 flex-grow pr-2 font-medium break-words">
						{remoteDrag.taskName}
					</span>
				</div>
			)}

			{provided.placeholder}
		</div>
	);
};

export default WrapColumn;
