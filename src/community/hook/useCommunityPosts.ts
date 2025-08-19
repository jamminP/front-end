import { useMutation } from '@tanstack/react-query';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';

type ApiId = { id?: number; post_id?: number };

export function useCreateFree() {
  return useMutation<ApiId, Error, FormData>({
    mutationFn: async (fd) => {
      const res = await fetch(`${BASE}/api/v1/community/post/free`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`free 업로드 실패: ${res.status}`);
      return res.json();
    },
  });
}

export function useCreateShare() {
  return useMutation<ApiId, Error, FormData>({
    mutationFn: async (fd) => {
      const res = await fetch(`${BASE}/api/v1/community/post/share`, {
        method: 'POST',
        body: fd,
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`share 업로드 실패: ${res.status}`);
      return res.json();
    },
  });
}
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
