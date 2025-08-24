import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';

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
  currentUserId: number;
  isAdmin?: boolean;
  onClick: (id: number) => void;
}

const PostCard: FC<PostCardProps> = ({ post, currentUserId, isAdmin = false, onClick }) => {
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
  const recruit_start = recruit?.recruit_start;
  const recruit_end = recruit?.recruit_end;
  const study_start = recruit?.study_start;
  const study_end = recruit?.study_end;
  const max_member = typeof recruit?.max_member === 'number' ? recruit?.max_member : undefined;
  const displayName = post.author_nickname?.trim() || `#${post.author_id}`;

  return (
    <div
      className="bg-gray-100 rounded-xl shadow px-6 py-4 hover:bg-gray-200 cursor-pointer transition-all"
      onClick={handleCardClick}
    >
      <nav>
        <span className="font-semibold text-gray-800">{displayName}</span>
        <span className="ml-2 text-xs">{formatDate(post.created_at)}</span>
      </nav>

      {canEdit && (
        <div className="flex gap-2 justify-end">
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

          {(recruit_start || recruit_end) && (
            <p>
              모집기간 : {formatDate(recruit_start)} ~ {formatDate(recruit_end)}
            </p>
          )}

          {typeof max_member === 'number' && <p>모집인원 : {max_member}명</p>}

          {(study_start || study_end) && (
            <p>
              스터디 기간 : {formatDate(study_start)} ~ {formatDate(study_end)}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-700 mt-1 line-clamp-3">{post.content}</p>
      )}

      <div className="flex justify-end items-center mt-3 text-xs text-gray-500 gap-4">
        <span>💬 {post.comment_count ?? 0}</span>
        <span>❤️ {post.like_count ?? 0}</span>
        <span>👁 {post.views ?? 0}</span>
      </div>
    </div>
  );
};

export default PostCard;
