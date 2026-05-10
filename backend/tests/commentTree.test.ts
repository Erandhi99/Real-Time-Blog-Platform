import { describe, it, expect } from "vitest";
import { buildCommentTree } from "../src/utils/buildCommentTree";

const makeComment = (id: string, parentId: string | null) => ({
  id,
  body: `Comment ${id}`,
  deleted: false,
  createdAt: new Date(),
  authorId: "user1",
  author: { id: "user1", username: "alice" },
  postId: "post1",
  parentId,
});

describe("buildCommentTree", () => {
  it("returns empty array for empty input", () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it("returns top-level comments with empty replies", () => {
    const flat = [makeComment("1", null), makeComment("2", null)];
    const tree = buildCommentTree(flat);
    expect(tree).toHaveLength(2);
    expect(tree[0].replies).toEqual([]);
  });

  it("nests replies under correct parent", () => {
    const flat = [
      makeComment("1", null),
      makeComment("2", "1"),
      makeComment("3", "1"),
    ];
    const tree = buildCommentTree(flat);
    expect(tree).toHaveLength(1);
    expect(tree[0].replies).toHaveLength(2);
  });

  it("handles 3 levels of nesting", () => {
    const flat = [
      makeComment("1", null),
      makeComment("2", "1"),
      makeComment("3", "2"),
    ];
    const tree = buildCommentTree(flat);
    expect(tree[0].replies[0].replies[0].id).toBe("3");
  });

  it("ignores orphaned comments with unknown parentId", () => {
    const flat = [makeComment("1", null), makeComment("2", "nonexistent")];
    const tree = buildCommentTree(flat);
    expect(tree).toHaveLength(1);
  });
});
