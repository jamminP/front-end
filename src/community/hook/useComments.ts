import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '../api/community';
import type { CommentResponse } from '../api/types';

export type CommentNode = CommentResponse & { replies: CommentResponse[] };

function sortByDateAsc(a: CommentResponse, b: CommentResponse) {
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}

export function useComments(post_id: number, current_user_id: number) {
  const qc = useQueryClient();
  const [reply_to, setReplyTo] = useState<number | null>(null);

  const listQ = useQuery({
    queryKey: ['community', 'comments', post_id],
    queryFn: () => getComments(post_id, { order: 'id', offset: 0, limit: 50 }),
    staleTime: 15_000,
  });

  const items = useMemo<CommentResponse[]>(() => listQ.data?.items ?? [], [listQ.data]);

  const tree = useMemo<CommentNode[]>(() => {
    const roots = items.filter((c) => c.parent_id === null).sort(sortByDateAsc);

    const childrenMap = new Map<number, CommentResponse[]>();
    for (const c of items) {
      if (c.parent_id !== null) {
        const pid = Number(c.parent_id);
        const arr = childrenMap.get(pid) ?? [];
        arr.push(c);
        childrenMap.set(pid, arr);
      }
    }

    return roots.map((r) => ({
      ...r,
      replies: (childrenMap.get(r.id) ?? []).sort(sortByDateAsc),
    }));
  }, [items]);

  const mutation = useMutation({
    mutationFn: (payload: { content: string; parent_id: number | null }) =>
      createComment(post_id, {
        user: current_user_id,
        content: payload.content,
        parent_comment_id: payload.parent_id ?? 0,
      }),
    onSuccess: () => {
      setReplyTo(null);
      qc.invalidateQueries({ queryKey: ['community', 'comments', post_id] });
    },
  });

  return {
    tree,
    isLoading: listQ.isLoading,
    isError: listQ.isError,
    reply_to,
    setReplyTo,
    creating: mutation.isPending,
    createRoot: (content: string) => mutation.mutate({ content, parent_id: null }),
    createReply: (parent_id: number, content: string) => mutation.mutate({ content, parent_id }),
  };
}
