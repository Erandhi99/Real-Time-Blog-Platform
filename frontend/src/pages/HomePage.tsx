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

  const handleFilter = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", page, category, tag, search],
    queryFn: () => getPostsApi({ page, size: 10, category, tag, search }),
    placeholderData: (prev) => prev,
  });

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <div
        className="rounded-2xl p-6 sm:p-8 mb-8 border"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Latest Posts
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Read and share ideas from the community
            </p>
          </div>
          {isAuthenticated && (
            <Link
              to="/create"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl text-white transition"
              style={{ background: "var(--accent)" }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              New Post
            </Link>
          )}
        </div>
      </div>

      <PostFilters
        category={category}
        tag={tag}
        search={search}
        onCategoryChange={handleFilter(setCategory)}
        onTagChange={handleFilter(setTag)}
        onSearchChange={handleFilter(setSearch)}
      />

      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border p-5 animate-pulse"
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div
                className="h-3 rounded w-1/4 mb-3"
                style={{ background: "var(--bg-hover)" }}
              />
              <div
                className="h-5 rounded w-3/4 mb-2"
                style={{ background: "var(--bg-hover)" }}
              />
              <div
                className="h-4 rounded w-full"
                style={{ background: "var(--bg-hover)" }}
              />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div
          className="text-center py-16 rounded-xl border"
          style={{ borderColor: "var(--border)", color: "var(--danger)" }}
        >
          Failed to load posts. Make sure the backend is running.
        </div>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div
              className="text-center py-20 rounded-xl border"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <p className="text-lg mb-1">No posts found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
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
          {data.meta.total > 0 && (
            <p
              className="text-center text-xs mt-4"
              style={{ color: "var(--text-muted)" }}
            >
              Showing {data.data.length} of {data.meta.total} posts
            </p>
          )}
        </>
      )}
    </div>
  );
}
