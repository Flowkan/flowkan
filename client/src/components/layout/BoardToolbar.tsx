import { useState } from "react";
import ShareBoard from "../ui/modals/share-board";
import type { Board } from "../../pages/boards/types";
import { useBoardSocket } from "../../hooks/useBoardSocket";
import { Avatar } from "../ui/Avatar";
import { getUserLogged } from "../../store/profile/selectors";
import { useAppSelector } from "../../store";

interface BoardToolbarProps {
	readonly board: Board;
}

export function BoardToolbar({ board }: BoardToolbarProps) {
	const [showShareForm, setShowShareForm] = useState(false);
	const userData = useAppSelector(getUserLogged);
	const currentUserId = userData?.id;
	const users = useBoardSocket(board.id?.toString(), currentUserId);

	const handleShowShareForm = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowShareForm(true);
	};

	const handleCloseShareForm = () => setShowShareForm(false);

	return (
		<>
			<div className="ml-auto flex items-center gap-2 p-2">
				<div className="flex -space-x-2">
					{users.slice(0, 5).map((user) => (
						<div key={user.id} className="relative px-2">
							<Avatar
								name={user.name}
								photo={user.photo}
								size={30}
								className="animate-enter-avatar"
							/>
						</div>
					))}
					{users.length > 5 && (
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-xs font-bold text-gray-700">
							+{users.length - 5}
						</div>
					)}
				</div>

				{/* Botón Compartir */}
				<button
					onClick={handleShowShareForm}
					className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-white"
				>
					Compartir
				</button>
			</div>

			{showShareForm && (
				<ShareBoard board={board} handleHideMessage={handleCloseShareForm} />
			)}
		</>
	);
}
