import { useEffect, type ReactNode } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import { useNavigate, useParams } from "react-router-dom";
import storage from "../../utils/storage";
import { AUTH_ERRORS } from "../../utils/socket_errors";


interface SocketProviderProps {
	children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {
	// const user = useAppSelector(getUserLogged)
	 const { boardId } = useParams(); 	
	 const token = storage.get("auth") || ''
	 const navigate = useNavigate();
	useEffect(() => {	
		if(boardId){
			socket.auth = { 
				//Mientras el socket se use solo en /board/:boardId
				token,
				// user,
				boardId
			 }
			 socket.on("error:occurred",(error)=>{
				if(error.code === AUTH_ERRORS.ACCESS_DENIED){
					navigate("/login",{replace:true})
				}
			 })
			socket.connect();
		}	
		
		return () => {
			socket.off("error:occurred")
			socket.disconnect();
		};
	}, [boardId,token]);
	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
