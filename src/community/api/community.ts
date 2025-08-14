// import { http } from './http';
import {
  FreePostRequestDTO,
  SharePostRequestDTO,
  StudyPostRequestDTO,
  FreePostUpdateRequestDTO,
  SharePostUpdateRequestDTO,
  StudyPostUpdateRequestDTO,
  FreePostResponseDTO,
  SharePostResponseDTO,
  StudyPostResponseDTO,
  CommentResponseDTO,
} from './types';

export type CommentTreeItem = {
  id: number;
  post_id: number;
  content: string;
  author_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
};

// export async function listComments(postId: number): Promise<CommentTreeItem[]> {
//   try {
//     return await http<CommentTreeItem[]>(`/api/community/post/${postId}/comments`);
//   } catch (e: any) {
//     if (String(e?.message || '').startsWith('404')) return [];
//     throw e;
//   }
// }

type Category = 'all' | 'free' | 'share' | 'study';

export type CursorPage<T> = {
  items: T[];
  nextCursor: number | null;
};

function normalizeCursorPage<T>(raw: any): CursorPage<T> {
  const items = Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.item)
        ? raw.item
        : [];
  const nc = raw?.next_cursor ?? raw?.nextCursor ?? raw?.cursor ?? null;
  return { items, nextCursor: (nc ?? null) as number | null };
}

function qs(params: Record<string, unknown>) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') s.set(k, String(v));
  });
  const q = s.toString();
  return q ? `?${q}` : '';
}

function pathForCursor(category: Category) {
  switch (category) {
    case 'free':
      return '/api/community/post/free/list-cursor';
    case 'share':
      return '/api/community/post/share/list-cursor';
    case 'study':
      return '/api/community/post/study/list-cursor';
    case 'all':
    default:
      return '/api/community/post/all/list-cursor';
  }
}

async function getListCursor<T>(category: Category, cursor: number | null | undefined, q?: string) {
  const url = `${pathForCursor(category)}${qs({ cursor, q })}`;
  const res = await http<any>(url);
  return normalizeCursorPage<T>(res);
}

export const getFreeListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<FreePostResponseDTO>('free', cursor, q);

export const getShareListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<SharePostResponseDTO>('share', cursor, q);

export const getStudyListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<StudyPostResponseDTO>('study', cursor, q);

export const getAllListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<any>('all', cursor, q);

export type AnyPostResponseDTO = FreePostResponseDTO | SharePostResponseDTO | StudyPostResponseDTO;

export const createFreePost = (body: FreePostRequestDTO) =>
  http<FreePostResponseDTO>('/api/community/post/free', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getFreePost = (postId: number) =>
  http<FreePostResponseDTO>(`/api/community/post/free/${postId}`);

export const patchFreePost = (postId: number, body: FreePostUpdateRequestDTO, userId?: number) =>
  http<FreePostResponseDTO>(`/api/community/post/free/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const createSharePost = (body: SharePostRequestDTO) =>
  http<SharePostResponseDTO>('/api/community/post/share', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getSharePost = (postId: number) =>
  http<SharePostResponseDTO>(`/api/community/post/share/${postId}`);

export const patchSharePost = (postId: number, body: SharePostUpdateRequestDTO, userId?: number) =>
  http<SharePostResponseDTO>(`/api/community/post/share/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const createStudyPost = (body: StudyPostRequestDTO) =>
  http<StudyPostResponseDTO>('/api/community/post/study', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const getStudyPost = (postId: number) =>
  http<StudyPostResponseDTO>(`/api/community/post/study/${postId}`);

export const patchStudyPost = (postId: number, body: StudyPostUpdateRequestDTO, userId?: number) =>
  http<StudyPostResponseDTO>(`/api/community/post/study/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const joinStudyPost = (postId: number, userId: number) =>
  http<void>(`/api/community/post/study/${postId}/join`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });

export const createComment = (postId: number, content: string, userId: number, parentId?: number) =>
  http<CommentResponseDTO>(`/api/community/post/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      content,
      user_id: userId,
      parent_id: parentId ?? null,
    }),
  });

export const readLikeCount = (postId: number) =>
  http<{ count: number }>(`/api/community/post/${postId}/likes`);

export const toggleLike = (postId: number, userId?: number) =>
  http<void>(`/api/community/post/${postId}/like`, {
    method: 'POST',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const likeStatus = (postId: number, userId?: number) =>
  http<{ liked: boolean }>(`/api/community/post/${postId}/like/status`, {
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const deletePost = (postId: number, userId?: number) =>
  http<void>(`/api/community/post/${postId}`, {
    method: 'DELETE',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });
