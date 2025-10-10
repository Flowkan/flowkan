import "dotenv/config";
import ioClient, { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../../sockets/types';

const SOCKET_API_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export const socketClientFromWorker:Socket<ServerToClientEvents,ClientToServerEvents> = ioClient(    
    `${SOCKET_API_URL}/worker`,
    {
		path: "/api/socket.io",     
		withCredentials: true,
		transports: ["websocket"],
		// autoConnect: true,
        auth:{
            token: process.env.SOCKET_WORKER_SECRET_KEY || 'superdupersecretworker'
        }
	},
)