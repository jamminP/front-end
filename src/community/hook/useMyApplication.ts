import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyStudyApplication } from '../api/community';

export function useMyApplication(post_id: number) {
  const qc = useQueryClient();
  const key = ['community', 'study-application', post_id];

  const { data, isLoading, refetch } = useQuery({
    queryKey: key,
    queryFn: () => getMyStudyApplication(post_id),
    staleTime: 60_000,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: key });

  return { app: data, isLoading, refetch, invalidate };
}
