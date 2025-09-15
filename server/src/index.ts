import 'dotenv/config';

import app from "./app";
import http from 'node:http'

const PORT: string | number = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
