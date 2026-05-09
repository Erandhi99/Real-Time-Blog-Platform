import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPostsApi } from "../api/posts";
import PostCard from "../components/posts/PostCard";
import PostFilters from "../components/posts/PostFilters";
import Pagination from "../components/posts/Pagination";

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");

  // Reset to page 1 when filters change
  const handleFilterChange = (setter: (v: string) => void) => (v: string) => {
    setter(v);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts", page, category, tag, search],
    queryFn: () => getPostsApi({ page, size: 10, category, tag, search }),
    placeholderData: (prev) => prev,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Latest Posts</h1>
        <p className="text-gray-500 mt-1">
          Read and share ideas from the community
        </p>
      </div>

      <PostFilters
        category={category}
        tag={tag}
        search={search}
        onCategoryChange={handleFilterChange(setCategory)}
        onTagChange={handleFilterChange(setTag)}
        onSearchChange={handleFilterChange(setSearch)}
      />

      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-12 text-red-500">
          Failed to load posts. Make sure the backend is running.
        </div>
      )}

      {data && (
        <>
          {data.data.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No posts found. Try adjusting your filters.
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
          <p className="text-center text-xs text-gray-400 mt-4">
            Showing {data.data.length} of {data.meta.total} posts
          </p>
        </>
      )}
    </div>
  );
}
