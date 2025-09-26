import { useEffect, type ReactNode } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";
import storage from "../../utils/storage";
import { AUTH_ERRORS } from "../../utils/socket_errors";
import { useAppSelector } from "../../store";
import { getCurrentBoard } from "../../store/boards/selectors";

interface SocketProviderProps {
	children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
	const board = useAppSelector(getCurrentBoard);
	const token = storage.get("auth") || "";
	const navigate = useNavigate();
	const boardId = board?.id;
	useEffect(() => {
		if (boardId && token) {
			socket.auth = {
				//Mientras el socket se use solo en /board/:boardId
				token,
				// user,
				boardId,
			};
			socket.on("error:occurred", (error) => {
				if (error.code === AUTH_ERRORS.ACCESS_DENIED) {
					navigate("/login", { replace: true });
				}
			});
			socket.connect();
		}

		return () => {
			socket.off("error:occurred");
			socket.disconnect();
		};
	}, [boardId, navigate, token]);
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export default SocketProvider;
