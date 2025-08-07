import { useQuery } from '@tanstack/react-query';
import { getPostsByCategory } from '../api/community';

export const useCommunityPosts = (category: string) => {
  return useQuery({
    queryKey: ['posts', category],
    queryFn: () => getPostsByCategory(category),
  });
};
