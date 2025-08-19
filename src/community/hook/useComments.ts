import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockListComments } from '../__mock__/dummyPost';
import { buildTwoLevelTree, type CommentNode } from '../utils/commentTree';

export function useComments(postId: number) {
  const {
    data: flat = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => mockListComments(postId),
  });

  const tree: CommentNode[] = useMemo(() => buildTwoLevelTree(flat), [flat]);
  return { flat, tree, isLoading, refetch };
}
