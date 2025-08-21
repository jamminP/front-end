import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getComments, createComment } from '../api/community';
import { CommentResponse } from '../api/types';

export type CommentNode = CommentResponse & { replies: CommentResponse[] };

export function useComments(post_id: number, current_user_id: number) {
  const qc = useQueryClient();
  const [reply_to, setReplyTo] = useState<number | null>(null);

  const listQ = useQuery({
    queryKey: ['community', 'comments', post_id],
    queryFn: () => getComments(post_id),
    staleTime: 15_000,
  });

  const items = useMemo<CommentResponse[]>(() => {
    const d = listQ.data;
    const arr = Array.isArray(d) ? d : [];
    return arr.map((c) => ({
      ...c,
      parent_id: c.parent_id,
    }));
  }, [listQ.data]);

  const tree = useMemo<CommentNode[]>(() => {
    const roots = items.filter((c) => c.parent_id === null).sort(sortByDateAsc);
    const childrenMap = new Map<number, CommentResponse[]>();

    items.forEach((c) => {
      if (c.parent_id !== null) {
        const pidNum = Number(c.parent_id);
        const arr = childrenMap.get(pidNum) ?? [];
        arr.push(c);
        childrenMap.set(pidNum, arr);
      }
    });

    return roots.map((r) => ({
      ...r,
      replies: (childrenMap.get(r.id) ?? []).sort(sortByDateAsc),
    }));
  }, [items]);

  const mutation = useMutation({
    mutationFn: (payload: { content: string; parent_id: number | null }) =>
      createComment(post_id, payload.content, current_user_id, payload.parent_id ?? undefined),
    onSuccess: () => {
      setReplyTo(null);
      qc.invalidateQueries({ queryKey: ['community', 'comments', post_id] });
    },
  });

  return {
    ...listQ,
    tree,
    reply_to,
    setReplyTo,
    createRoot: (content: string) => mutation.mutate({ content, parent_id: null }),
    createReply: (parent_id: number, content: string) => mutation.mutate({ content, parent_id }),
    creating: mutation.isPending,
  };
}

function sortByDateAsc(a: CommentResponse, b: CommentResponse) {
  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
}
