import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../api/community';

export function useDeletePost(onAfter?: () => void) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { post_id: number; user: number }) => deletePost(p),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) => Array.isArray(q.queryKey) && q.queryKey.some((k) => k === 'community'),
      });
      onAfter?.();
    },
  });
}
