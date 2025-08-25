// /src/Community/components/LikeButton.tsx
import { usePostLike } from '../../hook/usePostLike';

export default function LikeButton({
  post_id,
  current_user_id,
  stopPropagation = false,
  className,
}: {
  post_id: number;
  current_user_id: number;
  stopPropagation?: boolean;
  className?: string;
}) {
  const { liked, like_count, isPending, toggleLike } = usePostLike(post_id, current_user_id);

  const onClick = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    toggleLike();
  };

  return (
    <button
      type="button"
      aria-pressed={liked}
      title={liked ? '좋아요 취소' : '좋아요'}
      onClick={onClick}
      disabled={isPending}
      className={className ?? 'flex items-center gap-1 text-sm'}
    >
      <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
      <span>{like_count}</span>
    </button>
  );
}
