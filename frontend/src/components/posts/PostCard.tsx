import { Link } from "react-router-dom";
import type { Post } from "../../types";
import Badge from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link to={`/posts/${post.id}`} className="block group">
      <article
        className="rounded-xl border p-5 sm:p-6 transition-all duration-200 group-hover:shadow-md"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              <Badge variant="accent">{post.category.name}</Badge>
              {post.tags.slice(0, 3).map(({ tag }) => (
                <Badge key={tag.id}>{tag.name}</Badge>
              ))}
            </div>
            <h2
              className="text-base sm:text-lg font-semibold mb-1.5 leading-snug line-clamp-2 group-hover:underline"
              style={{ color: "var(--text-primary)" }}
            >
              {post.title}
            </h2>
            <p
              className="text-sm line-clamp-2 mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {post.body}
            </p>
          </div>
        </div>
        <div
          className="flex items-center justify-between text-xs pt-3 border-t"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                fontSize: "9px",
                background: `hsl(${post.author.username.charCodeAt(0) * 15}, 60%, 50%)`,
              }}
            >
              {post.author.username[0].toUpperCase()}
            </div>
            <span style={{ color: "var(--text-secondary)" }}>
              {post.author.username}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post._count.comments}
            </span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
