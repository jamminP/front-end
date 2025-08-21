import { useMutation } from '@tanstack/react-query';
import { createFreePost, createSharePost } from '../api/community';

export const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';

type ApiId = { id?: number; post_id?: number };

export const useCreateFree = () => useMutation({ mutationFn: createFreePost });

export const useCreateShare = () => useMutation({ mutationFn: createSharePost });

export function useCreateStudy() {
  return useMutation<ApiId, Error, any>({
    mutationFn: async (body) => {
      const res = await fetch(`${BASE}/api/v1/community/post/study`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`study 저장 실패: ${res.status}`);
      return res.json();
    },
  });
}
