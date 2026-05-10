import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(import.meta.env.VITE_WS_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socketInstance;
};

export const useSocket = (postId: string | undefined) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!postId) return;

    const socket = getSocket();
    socketRef.current = socket;

    socket.emit("join:post", { postId });

    return () => {
      socket.emit("leave:post", { postId });
    };
  }, [postId]);

  return getSocket();
};
