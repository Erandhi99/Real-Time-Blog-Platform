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
  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: getTagsApi,
  });

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-56"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="text-sm text-gray-500 hover:text-gray-800 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
