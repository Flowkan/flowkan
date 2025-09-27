import { useEffect, type ReactNode } from "react";
import { SocketContext } from "./context";
import { socket } from "../../socket";
import storage from "../../utils/storage";
import { AUTH_ERRORS } from "../../utils/socket_errors";
import { useAuth, useLogoutAction } from "../../store/auth/hooks";

interface SocketProviderProps {
	children: ReactNode;
}

const SocketProvider = ({ children }: SocketProviderProps) => {	
	const logout = useLogoutAction()
	const isLogged = useAuth();	
	useEffect(() => {
		if(isLogged){
			const token = storage.get("auth");
			if (!socket.connected && token) {
				socket.auth = {
					//Mientras el socket se use solo en /board/:boardId
					token,					
				};
				socket.connect();
				socket.on("error:occurred", (error) => {
					if (error.code === AUTH_ERRORS.ACCESS_DENIED) {					
						logout()					
					}
				});
			}
		}
		return () => {
			socket.off("error:occurred");			
		};
	}, [isLogged,logout]);
	return (
		<SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
	);
};

export default SocketProvider;
