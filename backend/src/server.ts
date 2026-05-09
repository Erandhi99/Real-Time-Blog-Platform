import { createServer } from "http";
import { Server } from "socket.io";
import app from "../src/app";
import { env } from "../src/config/env";
import { initSockets } from "../src/sockets";

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    credentials: true,
  },
});

initSockets(io);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
