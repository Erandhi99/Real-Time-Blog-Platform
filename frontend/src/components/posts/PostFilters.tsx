import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi, getTagsApi } from "../../api/posts";
import type { Category, Tag } from "../../types";

interface Props {
  category: string;
  tag: string;
  search: string;
  onCategoryChange: (v: string) => void;
  onTagChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

const inputStyle = {
  padding: "7px 10px",
  borderRadius: 8,
  fontSize: 13,
  border: "1px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text1)",
  outline: "none",
  height: 34,
};

export default function PostFilters({
  category,
  tag,
  search,
  onCategoryChange,
  onTagChange,
  onSearchChange,
}: Props) {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesApi,
  });
  const { data: tags } = useQuery({ queryKey: ["tags"], queryFn: getTagsApi });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 20,
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", flex: "1 1 180px" }}>
        <svg
          style={{
            position: "absolute",
            left: 9,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text3)",
          }}
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search posts…"
          style={{ ...inputStyle, paddingLeft: 28, width: "100%" }}
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">All categories</option>
        {categories?.map((c: Category) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">All tags</option>
        {tags?.map((t: Tag) => (
          <option key={t.id} value={t.slug}>
            {t.name}
          </option>
        ))}
      </select>

      {(category || tag || search) && (
        <button
          onClick={() => {
            onCategoryChange("");
            onTagChange("");
            onSearchChange("");
          }}
          style={{
            ...inputStyle,
            cursor: "pointer",
            color: "var(--danger)",
            background: "var(--danger-bg)",
            border: "1px solid var(--danger-bg)",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
