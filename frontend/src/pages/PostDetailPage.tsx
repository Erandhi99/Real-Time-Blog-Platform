import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getPostApi, deletePostApi } from "../api/posts";
import {
  getCommentsApi,
  createCommentApi,
  replyToCommentApi,
} from "../api/comments";
import { useAuthStore } from "../store/authStore";
import { useLiveComments } from "../hooks/useLiveComments";
import CommentTree from "../components/comments/CommentTree";
import CommentForm from "../components/comments/CommentForm";
import LiveIndicator from "../components/ui/LiveIndicator";
import Pagination from "../components/posts/Pagination";
import { formatDate } from "../utils/formatDate";
import type { CommentNode } from "../types";

const collectIds = (comments: CommentNode[]): Set<string> => {
  const ids = new Set<string>();
  const walk = (list: CommentNode[]) =>
    list.forEach((c) => {
      ids.add(c.id);
      walk(c.replies);
    });
  walk(comments);
  return ids;
};

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [commentPage, setCommentPage] = useState(1);
  const { liveComments, readerCount } = useLiveComments(id);

  const { data: post, isLoading } = useQuery({
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

  const displayComments = (() => {
    const rest = commentsData?.data ?? [];
    const existingIds = collectIds(rest);
    const newLive = liveComments.filter((c) => !existingIds.has(c.id));
    return [...rest, ...newLive];
  })();

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 240 : 60,
              borderRadius: "var(--radius-lg)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ color: "var(--text3)", marginBottom: 12 }}>
          Post not found.
        </p>
        <Link to="/" style={{ color: "var(--accent)", fontSize: 14 }}>
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <Link
        to="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          fontSize: 13,
          color: "var(--text3)",
          marginBottom: 20,
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        All posts
      </Link>

      {/* Post */}
      <article
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px 28px",
          marginBottom: 28,
        }}
      >
        {/* Top meta */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 9px",
                borderRadius: 20,
                background: "var(--accent-bg)",
                color: "var(--accent-text)",
              }}
            >
              {post.category.name}
            </span>
            {post.tags.map(({ tag }) => (
              <span
                key={tag.id}
                style={{
                  fontSize: 11,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: "var(--surface2)",
                  color: "var(--text3)",
                  border: "1px solid var(--border)",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <LiveIndicator count={readerCount} />
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "var(--text1)",
            lineHeight: 1.35,
            marginBottom: 14,
          }}
        >
          {post.title}
        </h1>

        {/* Author row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 18,
            marginBottom: 18,
            borderBottom: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `hsl(${(post.author.username.charCodeAt(0) * 17) % 360}, 55%, 50%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {post.author.username[0].toUpperCase()}
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text1)",
                  margin: 0,
                }}
              >
                {post.author.username}
              </p>
              <p style={{ fontSize: 11, color: "var(--text3)", margin: 0 }}>
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          {user?.id === post.author.id && (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={handleDeletePost}
                style={{
                  padding: "5px 12px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: "var(--danger-bg)",
                  color: "var(--danger)",
                  border: "1px solid var(--danger-bg)",
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        <div
          style={{
            fontSize: 14,
            color: "var(--text2)",
            lineHeight: 1.75,
            whiteSpace: "pre-wrap",
          }}
        >
          {post.body}
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "var(--text1)",
            marginBottom: 16,
          }}
        >
          Comments
          {commentsData && (
            <span
              style={{
                fontSize: 13,
                fontWeight: 400,
                color: "var(--text3)",
                marginLeft: 6,
              }}
            >
              ({commentsData.meta.total})
            </span>
          )}
        </h2>

        {/* Comment form */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "16px 18px",
            marginBottom: 20,
          }}
        >
          {isAuthenticated ? (
            <>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text3)",
                  marginBottom: 10,
                }}
              >
                Commenting as{" "}
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                  {user?.username}
                </span>
              </p>
              <CommentForm onSubmit={handleCreateComment} />
            </>
          ) : (
            <p
              style={{
                fontSize: 13,
                color: "var(--text3)",
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              <Link
                to="/login"
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                Sign in
              </Link>{" "}
              to join the conversation
            </p>
          )}
        </div>

        {/* Tree */}
        {commentsLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "var(--surface2)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 4,
                      background: "var(--surface2)",
                      width: "25%",
                      marginBottom: 8,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      borderRadius: 4,
                      background: "var(--surface2)",
                      width: "80%",
                      marginBottom: 6,
                    }}
                  />
                  <div
                    style={{
                      height: 12,
                      borderRadius: 4,
                      background: "var(--surface2)",
                      width: "60%",
                    }}
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

        <Pagination
          page={commentsData?.meta.page ?? 1}
          totalPages={commentsData?.meta.totalPages ?? 1}
          onPageChange={setCommentPage}
        />
      </section>
    </div>
  );
}
