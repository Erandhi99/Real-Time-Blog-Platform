import { useEffect, useRef, useState } from "react";
import type { CommentNode } from "../types";
import { useSocket } from "./useSocket";

export const useLiveComments = (postId: string | undefined) => {
  const [liveComments, setLiveComments] = useState<CommentNode[]>([]);
  const [readerCount, setReaderCount] = useState(0);
  const activePostId = useRef(postId);
  const socket = useSocket(postId);

  useEffect(() => {
    activePostId.current = postId;
  });

  useEffect(() => {
    if (!postId) return;

    const handleNewComment = (comment: CommentNode) => {
      setLiveComments((prev) => {
        // Avoid duplicates
        if (prev.find((c) => c.id === comment.id)) return prev;

        // If it's a top-level comment, add to list
        if (!comment.parentId) {
          return [...prev, { ...comment, replies: [] }];
        }

        // If it's a reply, insert into the correct parent recursively
        return insertReply(prev, comment);
      });
    };

    const handleReadersUpdate = ({
      count,
    }: {
      postId: string;
      count: number;
    }) => {
      setReaderCount(count);
    };

    socket.on("comment:new", handleNewComment);
    socket.on("readers:update", handleReadersUpdate);

    return () => {
      socket.off("comment:new", handleNewComment);
      socket.off("readers:update", handleReadersUpdate);
    };
  }, [postId, socket]);

  return { liveComments, readerCount };
};

const insertReply = (
  comments: CommentNode[],
  reply: CommentNode,
): CommentNode[] => {
  return comments.map((comment) => {
    if (comment.id === reply.parentId) {
      const alreadyExists = comment.replies.find((r) => r.id === reply.id);
      if (alreadyExists) return comment;
      return {
        ...comment,
        replies: [...comment.replies, { ...reply, replies: [] }],
      };
    }
    if (comment.replies.length > 0) {
      return { ...comment, replies: insertReply(comment.replies, reply) };
    }
    return comment;
  });
};
