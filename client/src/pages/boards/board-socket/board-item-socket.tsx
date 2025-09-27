import { useEffect, useRef, useState, type ReactNode } from "react";
import { BoardItemSocketContext } from "./context";
import type { DragStart, DragUpdate, DropResult } from "@hello-pangea/dnd";
import { useSocket } from "../../../hooks/socket/context";
import { useAppSelector } from "../../../store";
import { getCurrentBoard } from "../../../store/boards/selectors";
import { usePointerItemDrag } from "./useLastPointerItemDrag";
import type { ServerToClientEvents } from "../../../hooks/socket/socket";

type DragStartedPayload = Parameters<
	ServerToClientEvents["board:dragstarted"]
>[0];

type DragShowCoordsPayload = Parameters<
	ServerToClientEvents["board:dragshowcoords"]
>[0];

type DragUpdatedPayload = Parameters<
	ServerToClientEvents["board:dragupdated"]
>[0];

type DragFailedPayload = Parameters<
	ServerToClientEvents["board:dragfailed"]
>[0];

interface BoardItemSocketProps {
	children: ReactNode;
}

const BoardItemSocket = ({ children }: BoardItemSocketProps) => {
	const socket = useSocket();
	const board = useAppSelector(getCurrentBoard);

	const [isDragging, setIsDragging] = useState(false);
	const [remoteDrag, setRemoteDrag] = useState<null | {
		userId: string;
		name: string;
		taskName: string;
		draggableId: string;
		source: { droppableId: string; index: number };
		coords?: { xNorm: number; yNorm: number };
		destination?: { droppableId: string; index: number };
	}>(null);
	const [tasklock, setTaskLock] = useState<string | null>(null);
	const itemDrag = useRef<HTMLDivElement | null>(null);

	//Coords Ref
	const coordsItemDrag = usePointerItemDrag(itemDrag);

	function handleDragStart(start: DragStart) {
		const x = coordsItemDrag.current
			? coordsItemDrag.current.x / window.innerWidth
			: 0;
		const y = coordsItemDrag.current
			? coordsItemDrag.current.y / window.innerHeight
			: 0;

		if (board) {
			const {
				draggableId,
				source: { droppableId },
			} = start;
			const column = board.lists.find(
				(col) => Number(col.id) === Number(droppableId),
			);
			if (!column) return;
			const task = column!.cards.find(
				(card) => Number(card.id) === Number(draggableId),
			);
			if (!task) return;
			socket.emit("board:dragstart", { start, task, x, y });
			setIsDragging(true);
		}
	}

	function handleDragUpdate(update: DragUpdate) {
		socket.emit("board:dragupdate", {
			update,
		});
	}

	function handleDragEnd(result: DropResult) {
		setIsDragging(false);
		socket.emit("board:dragend", { result });
	}

	const values = {
		tasklock,
		itemDrag,
		remoteDrag,
		handleDragStart,
		handleDragUpdate,
		handleDragEnd,
	};
	useEffect(() => {
		if (!socket) return;

		const handleDragStarted = (payload: DragStartedPayload) => {
			if (payload) {
				const { start, userId, name, task } = payload;
				if (!start) return;
				const { draggableId, source } = start as DragStart;
				setRemoteDrag({
					userId,
					name,
					taskName: task.title,
					draggableId,
					source,
				});
			}
		};

		const handleDragShowCoords = ({ x, y }: DragShowCoordsPayload) => {
			setRemoteDrag((currentRemoteDrag) => {
				if (!currentRemoteDrag) return null;
				return {
					...currentRemoteDrag,
					coords: { xNorm: x, yNorm: y },
				};
			});
		};

		const handleDragUpdated = ({ update }: DragUpdatedPayload) => {
			const { destination, draggableId } = update as DragUpdate;
			if (!destination) return;

			setRemoteDrag((currentRemoteDrag) => {
				if (!currentRemoteDrag) return null;
				return {
					...currentRemoteDrag,
					draggableId,
					destination: {
						droppableId: destination.droppableId,
						index: destination.index,
					},
				};
			});
		};

		const handleDragEnd = () => {
			setRemoteDrag(null);
			setTaskLock(null);
		};

		const handleDragFailed = (payload: DragFailedPayload) => {
			const { draggableId } = payload;
			if (draggableId) {
				setTaskLock(draggableId);
			}
		};

		socket.on("board:dragstarted", handleDragStarted);
		socket.on("board:dragshowcoords", handleDragShowCoords);
		socket.on("board:dragupdated", handleDragUpdated);
		socket.on("board:dragend", handleDragEnd);
		socket.on("board:dragfailed", handleDragFailed);

		return () => {
			socket.off("board:dragstarted", handleDragStarted);
			socket.off("board:dragshowcoords", handleDragShowCoords);
			socket.off("board:dragupdated", handleDragUpdated);
			socket.off("board:dragend", handleDragEnd);
			socket.off("board:dragfailed", handleDragFailed);
		};
	}, [socket, remoteDrag]);

	//Pasar movimientos de arrastre cada 50 milisegundos para suavizar los movimientos
	useEffect(() => {
		if (!isDragging) return;

		let throttleTimeout: NodeJS.Timeout | null = null;

		const handleMouseMove = () => {
			if (throttleTimeout) return;
			if (!itemDrag.current) return;

			throttleTimeout = setTimeout(() => {
				const item = itemDrag.current!;
				const rect = item.getBoundingClientRect();
				const x = rect.left / window.innerWidth;
				const y = rect.top / window.innerHeight;
				socket.emit("board:dragsendcoords", {
					x,
					y,
				});
				throttleTimeout = null;
			}, 50);
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			if (throttleTimeout) {
				clearTimeout(throttleTimeout);
			}
		};
	}, [socket, isDragging]);

	return (
		<BoardItemSocketContext.Provider value={values}>
			{children}
		</BoardItemSocketContext.Provider>
	);
};

export default BoardItemSocket;
