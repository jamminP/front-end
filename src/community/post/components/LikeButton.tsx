// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { likeStatus, readLikeCount, toggleLike } from '../../api/community';

// export default function LikeButton({
//   postId,
//   currentUserId,
// }: {
//   postId: number;
//   currentUserId?: number;
// }) {
//   const qc = useQueryClient();

//   const qStatus = useQuery({
//     queryKey: ['like', 'status', postId, currentUserId ?? null] as const,
//     queryFn: () => likeStatus(postId, currentUserId),
//   });

//   const qCount = useQuery({
//     queryKey: ['like', 'count', postId] as const,
//     queryFn: () => readLikeCount(postId),
//   });

//   const mut = useMutation({
//     mutationFn: () => toggleLike(postId, currentUserId),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['like', 'status', postId, currentUserId ?? null] });
//       qc.invalidateQueries({ queryKey: ['like', 'count', postId] });
//     },
//   });

//   const liked = (qStatus.data as any)?.liked === true;
//   const count = (qCount.data as any)?.count ?? 0;

//   return (
//     <button
//       className={`px-2 py-1 rounded-lg text-sm ${liked ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
//       onClick={() => mut.mutate()}
//       disabled={mut.isPending}
//       title={liked ? '좋아요 취소' : '좋아요'}
//     >
//       ❤️ {count}
//     </button>
//   );
// }

//목 코드
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockLikeStatus, mockReadLikeCount, mockToggleLike } from '../../__mock__/dummyPost';

export default function LikeButtonMock({
  postId,
  currentUserId,
}: {
  postId: number;
  currentUserId?: number;
}) {
  const qc = useQueryClient();

  const qStatus = useQuery({
    queryKey: ['like', 'status', 'mock', postId, currentUserId ?? null] as const,
    queryFn: () => mockLikeStatus(postId, currentUserId),
  });

  const qCount = useQuery({
    queryKey: ['like', 'count', 'mock', postId] as const,
    queryFn: () => mockReadLikeCount(postId),
  });

  const mut = useMutation({
    mutationFn: () => mockToggleLike(postId, currentUserId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['like', 'status', 'mock', postId, currentUserId ?? null] });
      qc.invalidateQueries({ queryKey: ['like', 'count', 'mock', postId] });
    },
  });

  const liked = (qStatus.data as any)?.liked === true;
  const count = (qCount.data as any)?.count ?? 0;

  return (
    <button
      className={`px-2 py-1 rounded-lg text-sm ${liked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700'}`}
      onClick={() => mut.mutate()}
      disabled={mut.isPending}
      title={liked ? '좋아요 취소' : '좋아요'}
    >
      ❤️ {count}
    </button>
  );
}
