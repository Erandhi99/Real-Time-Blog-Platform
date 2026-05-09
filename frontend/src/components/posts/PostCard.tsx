import { Link } from "react-router-dom";
import type { Post } from "../../types";

interface Props {
  post: Post;
}

export default function PostCard({ post }: Props) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link to={`/posts/${post.id}`}>
      <article className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition cursor-pointer">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium">
            {post.category.name}
          </span>
          {post.tags.slice(0, 3).map(({ tag }) => (
            <span
              key={tag.id}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.body}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>
            by{" "}
            <span className="font-medium text-gray-600">
              {post.author.username}
            </span>
          </span>
          <div className="flex items-center gap-3">
            <span>{post._count.comments} comments</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
