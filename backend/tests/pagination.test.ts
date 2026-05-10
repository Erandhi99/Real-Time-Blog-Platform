import { describe, it, expect } from "vitest";

const paginate = <T>(items: T[], page: number, size: number) => {
  const total = items.length;
  const totalPages = Math.ceil(total / size);
  const safePage = Math.max(1, Math.min(page, totalPages || 1));
  const data = items.slice((safePage - 1) * size, safePage * size);
  return { data, meta: { total, page: safePage, size, totalPages } };
};

describe("pagination", () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it("returns correct first page", () => {
    const result = paginate(items, 1, 10);
    expect(result.data).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(result.meta.totalPages).toBe(3);
  });

  it("returns correct last page with fewer items", () => {
    const result = paginate(items, 3, 10);
    expect(result.data).toEqual([21, 22, 23, 24, 25]);
    expect(result.meta.page).toBe(3);
  });

  it("clamps page number when out of range", () => {
    const result = paginate(items, 99, 10);
    expect(result.meta.page).toBe(3);
  });

  it("handles empty list gracefully", () => {
    const result = paginate([], 1, 10);
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });

  it("page 0 is clamped to 1", () => {
    const result = paginate(items, 0, 10);
    expect(result.meta.page).toBe(1);
  });
});
