import React, { FC } from 'react';
import type { Post } from '../api/types';

interface PostCardProps {
  post: Post;
  currentUserId: number;
  isAdmin?: boolean;
  onClick: (id: number) => void;
}

const PostCard: FC<PostCardProps> = ({ post, currentUserId, isAdmin = false, onClick }) => {
  const canEdit = isAdmin || post.postId === currentUserId;

  const handleCardClick = () => {
    onClick(post.postId);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation;
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation;
  };

  return (
    <div
      className="bg-gray-100 rounded-xl shadow px-6 py-4 hover:bg-gray-200 cursor-pointer transition-all"
      onClick={handleCardClick}
    >
      <nav>
        <span className="font-semibold text-gray-800">{post.author}</span>
        <span className="ml-2 text-xs">{post.createdAt}</span>
      </nav>
      {canEdit && (
        <div className="flex gap-2">
          <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleEditClick}>
            수정
          </button>
          <button className="text-xs text-black hover:text-[#0180F5]" onClick={handleDeleteClick}>
            삭제
          </button>
        </div>
      )}
      <h3 className="text-lg font-bold mt-2">{post.title}</h3>
      {post.category === 'study' ? (
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>{post.content}</p>
          <p>
            모집기간 : {post.recruitStart} ~ {post.recruitEnd}
          </p>
          <p>모집인원 : {post.maxMembers}명</p>
        </div>
      ) : (
        <p className="text-sm text-gray-700 mt-1 line-clamp-3">{post.content}</p>
      )}
      <div className="flex justify-end items-center mt-3 text-xs text-gray-500 gap-4">
        <span>💬 {post.comments}</span>
        <span>❤️ {post.likes}</span>
        <span>👁 {post.views}</span>
      </div>
    </div>
  );
};

export default PostCard;
