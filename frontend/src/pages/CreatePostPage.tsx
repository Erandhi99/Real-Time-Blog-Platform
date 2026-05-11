import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createPostApi, getCategoriesApi, getTagsApi } from "../api/posts";
import { useAuthStore } from "../store/authStore";
import Button from "../components/ui/Button";
import type { Category, Tag } from "../types";
import axios from "axios";

export default function CreatePostPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  const { data: tags } = useQuery({ queryKey: ["tags"], queryFn: getTagsApi });

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <p style={{ color: "var(--text-secondary)" }}>
          <Link to="/login" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>{" "}
          to create a post.
        </p>
      </div>
    );
  }

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const post = await createPostApi({
        title,
        body,
        categoryId,
        tags: selectedTags,
      });
      // Invalidate post list so home page refetches fresh data
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${post.id}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to create post");
      } else {
        setError("Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Create a new post
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Share your ideas with the community
        </p>
      </div>

      <div
        className="rounded-2xl border p-6 sm:p-8"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{
              background: "var(--danger-light)",
              color: "var(--danger)",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              placeholder="What's this post about?"
              className="w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <option value="">Select a category</option>
              {categories?.map((c: Category) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Tags{" "}
              <span style={{ color: "var(--text-muted)" }}>(optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {tags?.map((t: Tag) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTag(t.id)}
                  className="px-3 py-1 text-xs rounded-full border transition"
                  style={{
                    background: selectedTags.includes(t.id)
                      ? "var(--accent)"
                      : "var(--bg-secondary)",
                    borderColor: selectedTags.includes(t.id)
                      ? "var(--accent)"
                      : "var(--border)",
                    color: selectedTags.includes(t.id)
                      ? "white"
                      : "var(--text-secondary)",
                  }}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              Content
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              minLength={10}
              rows={10}
              placeholder="Write your post here..."
              className="w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-2 resize-none transition"
              style={{
                background: "var(--bg-secondary)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
