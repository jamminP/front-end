import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment } from '../api/community';

export function useDeleteComment(post_id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { comment_id: number; user: number }) => deleteComment(p),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey.includes(post_id) &&
          q.queryKey.some((k) => k === 'comments' || k === 'comment' || k === 'commentTree'),
      });
    },
  });
}
