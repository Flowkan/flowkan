import { useEffect, type ReactNode } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import { useAppSelector } from "../../store";
import { getUserLogged } from "../../store/selectors";
import { useParams } from "react-router-dom";

interface SocketProviderProps {
	children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
	const user = useAppSelector(getUserLogged)
	 const { boardId } = useParams(); 	
	useEffect(() => {	
		if(user && boardId){
			socket.auth = { user,boardId }
			socket.connect();
		}	
		
		return () => {
			socket.disconnect();
		};
	}, [user,boardId]);
	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
