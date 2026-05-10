import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getPostsApi } from "../api/posts";
import { useAuthStore } from "../store/authStore";
import PostCard from "../components/posts/PostCard";
import PostFilters from "../components/posts/PostFilters";
import Pagination from "../components/posts/Pagination";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useAuthStore();

  const set = (fn: (v: string) => void) => (v: string) => {
    fn(v);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", page, category, tag, search],
    queryFn: () => getPostsApi({ page, size: 10, category, tag, search }),
    placeholderData: (p) => p,
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text1)",
              margin: 0,
            }}
          >
            Latest posts
          </h1>
          <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 4 }}>
            {data
              ? `${data.meta.total} post${data.meta.total !== 1 ? "s" : ""}`
              : ""}
          </p>
        </div>
        {isAuthenticated && (
          <Link
            to="/create"
            style={{
              padding: "7px 14px",
              borderRadius: 8,
              background: "var(--accent)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <svg
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New post
          </Link>
        )}
      </div>

      <PostFilters
        category={category}
        tag={tag}
        search={search}
        onCategoryChange={set(setCategory)}
        onTagChange={set(setTag)}
        onSearchChange={set(setSearch)}
      />

      {isLoading && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 110,
                borderRadius: "var(--radius-lg)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      )}

      {isError && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 0",
            color: "var(--danger)",
            fontSize: 14,
          }}
        >
          Could not load posts — is the backend running?
        </div>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "64px 0",
                color: "var(--text3)",
                fontSize: 14,
                border: "1px dashed var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              No posts found. Try clearing your filters.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.data.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
