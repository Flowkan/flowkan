import "dotenv/config";
import app from "./app";
import http from "node:http";
import { Server } from "socket.io";
import registerSockets from "./sockets/index";

const PORT: string | number = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  path: "/api/socket.io",
  cors: {
    origin: process.env.FRONTEND_WEB_URL,
    methods: ["GET", "POST"],
  },
});

registerSockets(io);

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export { io };
