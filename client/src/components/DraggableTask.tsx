import type {
	DraggableProvided,
	DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Task } from "../pages/boards/types";
import { Avatar } from "./ui/Avatar";
import { useBoardItemSocket } from "../pages/boards/board-socket/context";

interface DraggableTaskProps {
	provided: DraggableProvided;
	snapshot: DraggableStateSnapshot;
	task: Task;
	handleClick: () => void;
}
const DraggableTask = ({
	provided,
	snapshot,
	task,
	handleClick,
}: DraggableTaskProps) => {
	const { remoteDrag, itemDrag: taskRef } = useBoardItemSocket();

	const listRef = (el: HTMLDivElement | null) => {
		provided.innerRef(el);
		if (taskRef && snapshot.isDragging) {
			taskRef.current = el;
		}
	};

	return (
		<div
			ref={listRef}
			{...provided.draggableProps}
			{...provided.dragHandleProps}
			onClick={handleClick}
			className={`text-text-body relative z-10 mb-3 flex cursor-pointer flex-col rounded-md border-2 p-3 shadow-md transition-all duration-200 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:rotate-0 hover:shadow-xl hover:shadow-indigo-300/30 active:scale-95 ${
				snapshot.isDragging
					? "bg-accent-lightest ring-accent-light shadow-lg ring-2"
					: "hover:border-accent-light border-gray-100 bg-white/20 hover:shadow-lg"
			} ${task.id && remoteDrag?.draggableId === task.id.toString() ? "hidden" : ""} `}
			style={{ ...provided.draggableProps.style }}
		>
			{task.labels && task.labels.length > 0 && (
				<div className="mb-2 flex flex-wrap gap-2">
					{task.labels.map((labelWrapper) => (
						<div
							key={labelWrapper.label.id}
							className="truncate rounded-md px-3 py-1 text-sm font-bold text-white shadow-sm"
							style={{
								backgroundColor: labelWrapper.label.color,
								border: "1px solid #333333",
								boxShadow: `1px 1px 2px ${labelWrapper.label.color}aa`,
								minWidth: "60px",
								textAlign: "center",
							}}
							title={labelWrapper.label.name}
						></div>
					))}
				</div>
			)}
			<div className="flex w-full items-center justify-between">
				<span className="text-text-heading flex-grow p-1 font-medium break-words">
					{task.title}
				</span>

				{(task.assignees ?? []).length > 0 && (
					<div className="flex gap-1">
						{task.assignees.map((assignee) => (
							<Avatar
								key={assignee.userId}
								name={assignee.user.name}
								photo={assignee.user.photo}
								size={24}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default DraggableTask;
