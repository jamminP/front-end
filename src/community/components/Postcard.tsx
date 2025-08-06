import { FC } from "react";
import type { Post } from "../api/community";

interface PostCardProps {
  post: Post;
  currentUserId: number;
  isAdmin?: boolean;
  onClick: (id: number) => void;
}

const PostCard: FC<PostCardProps> = ({
  post,
  currentUserId,
  isAdmin = false,
  onClick,
}) => {
  const canEdit = isAdmin || post.postId === currentUserId;

  return (
    <div
      className="bg-gray-100 rounded-xl shadow px-6 py-4 hover:bg-gray-200 cursor-pointer transition-all"
      onClick={() => onClick(post.postId)}
    >
      <nav>
        <span className="font-semibold text-gray-800">{post.author}</span>
        <span className="ml-2">{post.createdAt}</span>
      </nav>
      {canEdit && (
        <div className="flex gap-2">
          <button
            className="text-xs text-black hover:text-[#0180F5]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            수정
          </button>
          <button
            className="text-xs text-black hover:text-[#0180F5]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            삭제
          </button>
        </div>
      )}
      <h3 className="text-lg font-bold mt-2">{post.title}</h3>
      <p className="text-sm text-gray-700 mt-1 line-clamp-3">{post.content}</p>
      <div className="flex justify-end items-center mt-3 text-xs text-gray-500 gap-4">
        <span>💬 {post.comments}</span>
        <span>❤️ {post.likes}</span>
        <span>👁 {post.views}</span>
      </div>
    </div>
  );
};
