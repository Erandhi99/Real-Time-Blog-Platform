import React from "react";
import { Link } from "react-router-dom";
import type { Post } from "../../types";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/posts/${post.id}`} style={{ display: "block" }}>
      <article
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "16px 20px",
          transition: "border-color 0.15s",
          cursor: "pointer",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--accent)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
      >
        {/* Tags row */}
        <div
          style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 20,
              background: "var(--accent-bg)",
              color: "var(--accent-text)",
            }}
          >
            {post.category.name}
          </span>
          {post.tags.slice(0, 3).map(({ tag }) => (
            <span
              key={tag.id}
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "2px 8px",
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

        {/* Title */}
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--text1)",
            margin: "0 0 4px",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient:
              "vertical" as React.CSSProperties["WebkitBoxOrient"],
          }}
        >
          {post.title}
        </h2>

        {/* Excerpt */}
        <p
          style={{
            fontSize: 13,
            color: "var(--text3)",
            margin: "0 0 12px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient:
              "vertical" as React.CSSProperties["WebkitBoxOrient"],
            lineHeight: 1.5,
          }}
        >
          {post.body}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: "var(--text3)",
            borderTop: "1px solid var(--border)",
            paddingTop: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `hsl(${(post.author.username.charCodeAt(0) * 17) % 360}, 55%, 50%)`,
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
              }}
            >
              {post.author.username[0].toUpperCase()}
            </div>
            <span style={{ color: "var(--text2)", fontWeight: 500 }}>
              {post.author.username}
            </span>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <span>{post._count.comments} comments</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
