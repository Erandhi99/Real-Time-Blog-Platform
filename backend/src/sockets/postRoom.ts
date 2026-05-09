import { Server, Socket } from "socket.io";

// Map of postId -> Set of socket IDs currently in that room
const roomReaders = new Map<string, Set<string>>();

const getRoomCount = (postId: string): number => {
  return roomReaders.get(postId)?.size ?? 0;
};

export const registerPostRoomHandlers = (io: Server, socket: Socket) => {
  // Client joins a post room
  socket.on("join:post", ({ postId }: { postId: string }) => {
    if (!postId) return;

    socket.join(postId);

    if (!roomReaders.has(postId)) {
      roomReaders.set(postId, new Set());
    }
    roomReaders.get(postId)!.add(socket.id);

    // Broadcast updated reader count to everyone in the room
    io.to(postId).emit("readers:update", {
      postId,
      count: getRoomCount(postId),
    });

    console.log(
      `Socket ${socket.id} joined post:${postId} — readers: ${getRoomCount(postId)}`,
    );
  });

  // Client leaves a post room
  socket.on("leave:post", ({ postId }: { postId: string }) => {
    if (!postId) return;
    handleLeave(io, socket.id, postId);
  });

  // Handle browser close / network drop
  socket.on("disconnect", () => {
    // Remove socket from all rooms it was in
    roomReaders.forEach((readers, postId) => {
      if (readers.has(socket.id)) {
        handleLeave(io, socket.id, postId);
      }
    });
  });
};

const handleLeave = (io: Server, socketId: string, postId: string) => {
  const readers = roomReaders.get(postId);
  if (!readers) return;

  readers.delete(socketId);

  if (readers.size === 0) {
    roomReaders.delete(postId);
  }

  io.to(postId).emit("readers:update", {
    postId,
    count: getRoomCount(postId),
  });

  console.log(
    `Socket ${socketId} left post:${postId} — readers: ${getRoomCount(postId)}`,
  );
};

// Called by the comments controller to broadcast new comments
export const broadcastNewComment = (
  io: Server,
  postId: string,
  comment: any,
) => {
  io.to(postId).emit("comment:new", comment);
};
