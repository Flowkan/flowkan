import { useState } from "react";
import ShareBoard from "../ui/modals/share-board";
import { Avatar } from "../ui/Avatar";
import { useUsersOnBoard } from "../../hooks/socket/useUsersOnBoard";
import { ChatWindow } from "../ui/ChatWindow";

interface BoardToolbarProps {
	readonly boardId: string;
}

export function BoardToolbar({ boardId }: BoardToolbarProps) {
	const [showShareForm, setShowShareForm] = useState(false);
	const users = useUsersOnBoard(boardId);

	const handleShowShareForm = (event: React.MouseEvent) => {
		event.preventDefault();
		setShowShareForm(true);
	};

	const handleCloseShareForm = () => setShowShareForm(false);

	return (
		<>
			<div className="ml-auto flex items-center gap-2 p-2">
				<div className="flex items-center divide-x divide-solid divide-gray-300">
					<div className="flex -space-x-2 pr-4">
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

					<div className="pr-4 pl-4">
						{boardId && <ChatWindow boardId={boardId} />}
					</div>

					{/* Botón Compartir */}
					<div className="pl-4">
						<button
							onClick={handleShowShareForm}
							className="bg-primary hover:bg-primary-hover rounded px-3 py-1 text-white"
						>
							Compartir
						</button>
					</div>
				</div>
			</div>

			{showShareForm && (
				<ShareBoard
					boardId={boardId}
					handleHideMessage={handleCloseShareForm}
				/>
			)}
		</>
	);
}
