import { useState } from "react";
import ShareBoard from "../ui/modals/share-board";
import type { Board } from "../../pages/boards/types";
import { useBoardSocket } from "../../hooks/useBoardSocket";
import { Avatar } from "../ui/Avatar";
import { getUserLogged } from "../../store/profile/selectors";
import { useAppSelector } from "../../store";
import { ChatWindow } from "../ui/ChatWindow";

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
				{/* Contenedor principal con el "divide" */}
				<div className="flex items-center divide-x divide-solid divide-gray-300">
					{/* Avatares */}
					<div className="flex -space-x-2 pr-4">
						{" "}
						{/* Añade padding a la derecha (pr-4) para el espacio antes del separador */}
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

					{/* Chat */}
					<div className="pr-4 pl-4">
						{" "}
						{/* Añade padding a ambos lados (pl-4 pr-4) para el espacio */}
						{board.id && userData?.id && (
							<ChatWindow boardId={board.id} currentUserId={userData.id} />
						)}
					</div>

					{/* Botón Compartir */}
					<div className="pl-4">
						{" "}
						{/* Añade padding a la izquierda (pl-4) */}
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
				<ShareBoard board={board} handleHideMessage={handleCloseShareForm} />
			)}
		</>
	);
}
