import { Server } from "socket.io";
import { registerPostRoomHandlers } from "./postRoom";

export const initSockets = (io: Server) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    registerPostRoomHandlers(io, socket);
  });
};
