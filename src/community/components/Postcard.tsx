import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import LikeButton from '../post/components/LikeButton';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { HiMiniEye } from 'react-icons/hi2';
import useAuthStore from '@src/store/authStore';

export interface Post {
  id: number;
  title: string;
  author_id: number;
  author_nickname: string;
  category: 'free' | 'share' | 'study';
  content: string;
  created_at: string;
  views: number;
  like_count: number;
  comment_count: number;

  study_recruitment?: {
    badge?: string;
    recruit_start?: string;
    recruit_end?: string;
    max_member?: number;
    study_start?: string;
    study_end?: string;
  };
}

export interface PostCardProps {
  post: Post;
  isAdmin?: boolean;
  onClick: (id: number) => void;
}

const PostCard: FC<PostCardProps> = ({ post, isAdmin = false, onClick }) => {
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const canEdit = isAdmin || post.author_id === currentUserId;

  const handleCardClick = () => onClick(post.id);
  const navigate = useNavigate();
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/community/${post.category}/${post.id}/edit`);
  };
  const handleDeleteClick = (e: React.MouseEvent) => e.stopPropagation();

  function formatDate(iso?: string | null) {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  }

  const recruit = post.study_recruitment;
  const displayName = post.author_nickname?.trim() || `#${post.author_id}`;

  return (
    <div
      className="border-[0.8px] border-gray-200 rounded-lg px-4 py-2 bg-[var(--accent)] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition shadow-sm cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-wrap justify-between ">
        <div>
          <span className="font-medium text-m text-gray-800">{displayName}</span>
          <div>
            <span className="flex pb-1 text-gray-500 text-[10px] ">
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
        {canEdit && (
          <div className="">
            <button
              className="x-3 text-xs px-1 text-gray-500 hover:text-[#0180F5]"
              onClick={handleEditClick}
            >
              수정
            </button>
            <button
              className="x-3 text-xs text-gray-500 hover:text-[#0180F5]"
              onClick={handleDeleteClick}
            >
              삭제
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-between pt-1 border-t border-gray-200">
        <h3 className="text-lg pl-2 font-medium ">{post.title}</h3>

        <div className="flex justify-end items-center text-[10px] text-gray-500 gap-2">
          <span className="flex">
            {' '}
            <IoChatboxEllipsesOutline className="mt-[3px] mr-0.5" />
            {post.comment_count ?? 0}
          </span>
          <LikeButton post_id={post.id} stopPropagation />
          <span className="flex">
            <HiMiniEye className="mt-[3px] mr-0.5" />
            {post.views ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
