import { useEffect, useMemo, useRef } from "react";
import type { Task } from "../pages/boards/types";
import TaskCard from "./TaskCard";
import type {
	DroppableProvided,
	DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";

type placeholder = { id: string; isPlaceholder: boolean };
type taskWithPlaceholder = (placeholder | Task)[];

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
	const widthGhost = useRef(0);

	useEffect(() => {
		// Debounce para tomar el ancho del item drag
		let debounceTimeout: NodeJS.Timeout;

		const handleResize = () => {
			clearTimeout(debounceTimeout);

			debounceTimeout = setTimeout(() => {
				if (columnRef.current) {
					widthGhost.current = columnRef.current.clientWidth;
				}
			}, 150);
		};

		// Medición inicial
		if (columnRef.current) {
			widthGhost.current = columnRef.current.clientWidth;
		}

		window.addEventListener("resize", handleResize);

		// Limpieza
		return () => {
			window.removeEventListener("resize", handleResize);
			clearTimeout(debounceTimeout);
		};
	}, []);
	const items = useMemo(() => {			
		if (
			remoteDrag &&
			remoteDrag.destination?.droppableId === columnId &&
			remoteDrag.destination.index >= 0
		) {
			const clone: taskWithPlaceholder = cards ? [...cards] : [];
			clone.splice(remoteDrag.destination.index, 0, {
				id: "remote-placeholder",
				isPlaceholder: true,
			});
			return clone;
		}
		return cards ? cards : [];
	}, [cards, remoteDrag, columnId]);
	return (
		<div
			ref={setRefs}
			{...provided.droppableProps}
			className={`min-h-[50px] flex-grow rounded-md p-2 transition-colors duration-200 ${
				snapshot.isDraggingOver ? "bg-background-hover-column" : ""
			} custom-scrollbar overflow-y-auto`}
		>
			{items.map((item, index: number) => {
				return (
					<div key={item.id}>
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
					</div>
				);
			})}
			{/* Ghost remoto flotando */}
			{remoteDrag?.coords && (
				<div
					style={{
						top: remoteDrag.coords.yNorm * window.innerHeight,
						left: remoteDrag.coords.xNorm * window.innerWidth,
						width: `${widthGhost.current > 0 ? widthGhost.current - 16 : 0}px`,
						maxWidth: `${widthGhost.current > 0 ? widthGhost.current - 16 : 0}px`,
					}}
					className="text-text-body bg-background-column ring-accent-light pointer-events-none fixed mb-3 flex cursor-pointer flex-col rounded-md border-2 p-4 shadow-lg ring-2 transition-all duration-200 ease-in-out"
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
