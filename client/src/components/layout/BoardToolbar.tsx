import { useEffect, useState } from "react";
import ShareBoard from "../ui/modals/share-board";
import { Avatar } from "../ui/Avatar";
import { useSocket } from "../../hooks/socket/context";
import type { User } from "../../pages/login/types";
import type { ServerToClientEvents } from "../../hooks/socket/socket";

type UsersListPayload = Parameters<ServerToClientEvents["users:list"]>[0];

interface BoardToolbarProps {
	readonly boardId: string;
}

export function BoardToolbar({ boardId }: BoardToolbarProps) {
	const [showShareForm, setShowShareForm] = useState(false);
	const [users, setUsers] = useState<User[]>([]);
	const socket = useSocket();
	useEffect(()=>{
		if(boardId){
			// console.log(boardId);			
			socket.emit("join:room", boardId);
			socket.emit("request:users");
		}	
	},[socket,boardId])
	useEffect(() => {		
		// const handleUserJoined = (payload) => {
		// 	console.log("Usuario se unió a la sala:", payload);
		// };
		const handleUsersList = (payload:UsersListPayload) => {
			setUsers([...payload]);
		};		
		// socket.on("user:joined", handleUserJoined);
		socket.on("users:list", handleUsersList);					
		return () => {
			// socket.off("user:joined", handleUserJoined);
			socket.off("users:list", handleUsersList);
		};
	}, [socket, boardId]);

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
				<ShareBoard boardId={boardId} handleHideMessage={handleCloseShareForm} />
			)}
		</>
	);
}
