import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPostApi } from "../api/posts";
import {
  getCommentsApi,
  createCommentApi,
  replyToCommentApi,
} from "../api/comments";
import { deletePostApi } from "../api/posts";
import { useAuthStore } from "../store/authStore";
import { useLiveComments } from "../hooks/useLiveComments";
import CommentTree from "../components/comments/CommentTree";
import CommentForm from "../components/comments/CommentForm";
import LiveIndicator from "../components/ui/LiveIndicator";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Pagination from "../components/posts/Pagination";
import { formatDate } from "../utils/formatDate";
import type { CommentNode } from "../types";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [commentPage, setCommentPage] = useState(1);

  const { liveComments, readerCount } = useLiveComments(id);

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostApi(id!),
    enabled: !!id,
  });

  const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id, commentPage],
    queryFn: () => getCommentsApi(id!, commentPage),
    enabled: !!id,
  });

  const handleDeletePost = async () => {
    if (!confirm("Delete this post?")) return;
    await deletePostApi(id!);
    navigate("/");
  };

  const handleCreateComment = async (body: string) => {
    await createCommentApi(id!, body);
    queryClient.invalidateQueries({ queryKey: ["comments", id] });
  };

  const handleReply = async (commentId: string, body: string) => {
    await replyToCommentApi(id!, commentId, body);
    queryClient.invalidateQueries({ queryKey: ["comments", id] });
  };

  // Merge REST comments with live WebSocket comments, deduplicate
  const mergeComments = (
    restComments: CommentNode[],
    liveComments: CommentNode[],
  ): CommentNode[] => {
    const existingIds = new Set(collectIds(restComments));
    const newLive = liveComments.filter((c) => !existingIds.has(c.id));
    return [...restComments, ...newLive];
  };

  const collectIds = (comments: CommentNode[]): string[] => {
    return comments.flatMap((c) => [c.id, ...collectIds(c.replies)]);
  };

  if (postLoading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse space-y-4">
        <div
          className="h-8 rounded-lg w-3/4"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="h-4 rounded w-1/4"
          style={{ background: "var(--bg-card)" }}
        />
        <div
          className="h-64 rounded-xl"
          style={{ background: "var(--bg-card)" }}
        />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <p className="text-xl" style={{ color: "var(--text-muted)" }}>
          Post not found.
        </p>
        <Link
          to="/"
          className="text-sm mt-2 inline-block"
          style={{ color: "var(--accent)" }}
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  const displayComments = commentsData
    ? mergeComments(commentsData.data, liveComments)
    : liveComments;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm mb-6 transition"
        style={{ color: "var(--text-muted)" }}
      >
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All posts
      </Link>

      {/* Post card */}
      <article
        className="rounded-2xl p-6 sm:p-8 mb-8 border"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {/* Meta top row */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="accent">{post.category.name}</Badge>
            {post.tags.map(({ tag }) => (
              <Badge key={tag.id}>{tag.name}</Badge>
            ))}
          </div>
          <LiveIndicator count={readerCount} />
        </div>

        {/* Title */}
        <h1
          className="text-2xl sm:text-3xl font-bold mb-4 leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {post.title}
        </h1>

        {/* Author row */}
        <div
          className="flex items-center justify-between mb-6 pb-6 border-b flex-wrap gap-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{
                background: `hsl(${post.author.username.charCodeAt(0) * 15}, 60%, 50%)`,
              }}
            >
              {post.author.username[0].toUpperCase()}
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {post.author.username}
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {user?.id === post.author.id && (
            <div className="flex gap-2">
              <Link to={`/edit/${post.id}`}>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleDeletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          className="prose max-w-none text-base leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--text-secondary)" }}
        >
          {post.body}
        </div>
      </article>

      {/* Comments section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Comments
            {commentsData && (
              <span
                className="ml-2 text-base font-normal"
                style={{ color: "var(--text-muted)" }}
              >
                ({commentsData.meta.total})
              </span>
            )}
          </h2>
        </div>

        {/* New comment form */}
        {isAuthenticated ? (
          <div
            className="rounded-xl p-4 mb-8 border"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <p
              className="text-sm font-medium mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Comment as{" "}
              <span style={{ color: "var(--accent)" }}>{user?.username}</span>
            </p>
            <CommentForm onSubmit={handleCreateComment} />
          </div>
        ) : (
          <div
            className="rounded-xl p-4 mb-8 border text-center"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <Link to="/login" style={{ color: "var(--accent)" }}>
                Sign in
              </Link>{" "}
              to join the conversation
            </p>
          </div>
        )}

        {/* Comment tree */}
        {commentsLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{ background: "var(--bg-hover)" }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-3 rounded w-1/4"
                    style={{ background: "var(--bg-hover)" }}
                  />
                  <div
                    className="h-4 rounded w-full"
                    style={{ background: "var(--bg-hover)" }}
                  />
                  <div
                    className="h-4 rounded w-3/4"
                    style={{ background: "var(--bg-hover)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CommentTree
            comments={displayComments}
            postId={id!}
            onReply={handleReply}
          />
        )}

        {commentsData && (
          <div className="mt-8">
            <Pagination
              page={commentsData.meta.page}
              totalPages={commentsData.meta.totalPages}
              onPageChange={setCommentPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
