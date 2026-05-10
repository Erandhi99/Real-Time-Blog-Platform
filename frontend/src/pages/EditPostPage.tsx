import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  getPostApi,
  updatePostApi,
  getCategoriesApi,
  getTagsApi,
} from "../api/posts";
import { useAuthStore } from "../store/authStore";
import type { Category, Tag } from "../types";

const inputStyle = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: 8,
  fontSize: 14,
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  color: "var(--text1)",
  outline: "none",
  fontFamily: "inherit",
};
const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600 as const,
  color: "var(--text2)",
  marginBottom: 5,
};

// Inner form component — receives post data as props so useState
// initializers run once with the real values, avoiding useEffect pre-fill.
interface FormProps {
  initialTitle: string;
  initialBody: string;
  initialCategoryId: string;
  initialTagIds: string[];
  postId: string;
  categories: Category[];
  tags: Tag[];
}

function EditForm({
  initialTitle,
  initialBody,
  initialCategoryId,
  initialTagIds,
  postId,
  categories,
  tags,
}: FormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTagIds);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTag = (tagId: string) =>
    setSelectedTags((p) =>
      p.includes(tagId) ? p.filter((t) => t !== tagId) : [...p, tagId],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Please select a category");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await updatePostApi(postId, {
        title,
        body,
        categoryId,
        tags: selectedTags,
      });
      navigate(`/posts/${postId}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to update post");
      } else {
        setError("Failed to update post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 18 }}
    >
      {error && (
        <div
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 13,
            background: "var(--danger-bg)",
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          placeholder="Post title"
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={inputStyle}
        >
          <option value="">Select a category</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>
          Tags{" "}
          <span style={{ fontWeight: 400, color: "var(--text3)" }}>
            (optional)
          </span>
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {tags.map((t: Tag) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.id)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.12s",
                background: selectedTags.includes(t.id)
                  ? "var(--accent)"
                  : "var(--surface2)",
                color: selectedTags.includes(t.id) ? "#fff" : "var(--text2)",
                border: `1px solid ${selectedTags.includes(t.id) ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={labelStyle}>Content</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          minLength={10}
          rows={10}
          placeholder="Write your post here…"
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "flex-end",
          paddingTop: 4,
        }}
      >
        <button
          type="button"
          onClick={() => navigate(`/posts/${postId}`)}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            background: "transparent",
            color: "var(--text2)",
            border: "1px solid var(--border)",
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "9px 20px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuthStore();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostApi(id!),
    enabled: !!id,
  });
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTagsApi,
  });

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ color: "var(--text3)", fontSize: 14 }}>
          <Link to="/login" style={{ color: "var(--accent)" }}>
            Sign in
          </Link>{" "}
          to edit posts.
        </p>
      </div>
    );
  }

  if (postLoading) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              height: i === 3 ? 180 : 44,
              borderRadius: 8,
              marginBottom: 16,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          />
        ))}
      </div>
    );
  }

  if (post && post.author.id !== user?.id) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <p style={{ color: "var(--danger)", fontSize: 14 }}>
          You don't have permission to edit this post.
        </p>
        <Link
          to="/"
          style={{
            color: "var(--accent)",
            fontSize: 13,
            marginTop: 8,
            display: "inline-block",
          }}
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text1)",
            margin: 0,
          }}
        >
          Edit post
        </h1>
        <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>
          Update your post details below
        </p>
      </div>

      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
        }}
      >
        {post && (
          <EditForm
            key={post.id}
            postId={post.id}
            initialTitle={post.title}
            initialBody={post.body}
            initialCategoryId={post.category.id}
            initialTagIds={post.tags.map(({ tag }) => tag.id)}
            categories={categories ?? []}
            tags={tags ?? []}
          />
        )}
      </div>
    </div>
  );
}
