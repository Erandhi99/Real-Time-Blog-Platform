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
  const hasFilters = category || tag || search;

  return (
    <div
      className="rounded-xl border p-4 mb-6"
      style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition"
            style={{
              background: "var(--bg-secondary)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
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
          className="px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition"
          style={{
            background: "var(--bg-secondary)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">All tags</option>
          {tags?.map((t: Tag) => (
            <option key={t.id} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={() => {
              onCategoryChange("");
              onTagChange("");
              onSearchChange("");
            }}
            className="text-xs px-3 py-2 rounded-lg transition"
            style={{
              color: "var(--danger)",
              background: "var(--danger-light)",
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
