import { useEffect, useState } from "react";
import { useSocket } from "./context";
import type { User } from "../../pages/login/types";
import type { ServerToClientEvents } from "./socket";

type UsersListPayload = Parameters<ServerToClientEvents["users:list"]>[0];
type UserDisconnectedPayload = Parameters<
	ServerToClientEvents["user:disconnected"]
>[0];

export const useUsersOnBoard = (boardId: string) => {
	const socket = useSocket();
	const [users, setUsers] = useState<User[]>([]);
	
	useEffect(() => {
        if(!boardId){
            setUsers([])
            return
        }

		const handleUsersList = (payload: UsersListPayload) => {
			setUsers([...payload]);
		};	
        
        const handleUserJoined = (payload:{user:User,roomId:string}) => {
            const newUserJoined = payload.user
            setUsers(prev => {
                const userExist = prev.some(u=>u.id === newUserJoined.id)
                if(userExist) return prev

                return [...prev,newUserJoined]
                
            })
        }

		const handleUserDisconnected = (payload: UserDisconnectedPayload) => {
			// console.log('desconenctando',payload);
			setUsers(prev => prev.filter(u=>u.id !== payload.id));            
		};

        socket.on("users:list", handleUsersList);
        socket.on("user:joined",handleUserJoined)
		socket.on("user:disconnected", handleUserDisconnected);

        socket.emit("join:room", boardId);
		// socket.emit("request:users");

		return () => {
            // console.log('limpiando listeners usuarios',boardId);            
			socket.off("users:list", handleUsersList);
			socket.off("user:disconnected", handleUserDisconnected);

            //Dejando la sala
            socket.emit("leave:room",boardId)
		};
	}, [socket,boardId]);
	return users;
};
