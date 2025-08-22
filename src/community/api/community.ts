import { http } from './http';
import {
  FreePostRequest,
  SharePostRequest,
  StudyPostRequest,
  FreePostUpdateRequest,
  SharePostUpdateRequest,
  StudyPostUpdateRequest,
  FreePostResponse,
  SharePostResponse,
  StudyPostResponse,
  CommentResponse,
  SearchIn,
  TopCategory,
  TopWeeklyResponse,
  CommentRequest,
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

export async function listComments(postId: number): Promise<CommentTreeItem[]> {
  try {
    return await http<CommentTreeItem[]>(`/api/v1/community/post/${postId}/comments`);
  } catch (e: any) {
    if (String(e?.message || '').startsWith('404')) return [];
    throw e;
  }
}

type Category = 'all' | 'free' | 'share' | 'study';

export type CursorPage<T> = {
  items: T[];
  next_cursor: number | null;
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
  return { items, next_cursor: (nc ?? null) as number | null };
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
      return '/api/v1/community/post/free/list-cursor';
    case 'share':
      return '/api/v1/community/post/share/list-cursor';
    case 'study':
      return '/api/v1/community/post/study/list-cursor';
    case 'all':
    default:
      return '/api/v1/community/post/all/list-cursor';
  }
}

async function getListCursor<T>(
  category: Category,
  cursor: number | null | undefined,
  q?: string,
  limit = 20,
) {
  const url = `${pathForCursor(category)}${qs({ cursor, q, limit })}`;
  const res = await http<any>(url);
  return normalizeCursorPage<T>(res);
}

export const getFreeListCursor = (cursor: number | null | undefined, q?: string, limit?: number) =>
  getListCursor<FreePostResponse>('free', cursor, q, limit);

export const getShareListCursor = (cursor: number | null | undefined, q?: string, limit?: number) =>
  getListCursor<SharePostResponse>('share', cursor, q, limit);

export const getStudyListCursor = (cursor: number | null | undefined, q?: string, limit?: number) =>
  getListCursor<StudyPostResponse>('study', cursor, q, limit);

export type AnyPostResponse = FreePostResponse | SharePostResponse | StudyPostResponse;

export const getFreePost = (postId: number) =>
  http<FreePostResponse>(`/api/v1/community/post/free/${postId}`);

export const patchFreePost = (postId: number, body: FreePostUpdateRequest, userId?: number) =>
  http<FreePostResponse>(`/api/v1/community/post/free/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(userId ? { x_user_id: String(userId) } : {}),
    },
    body: JSON.stringify(body),
  });

/// createPost ///
export const createFreePost = (body: FreePostRequest) =>
  http<FreePostResponse>('/api/v1/community/post/free', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

export const createSharePost = (body: SharePostRequest) =>
  http<SharePostResponse>('/api/v1/community/post/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

export const createStudyPost = (body: StudyPostRequest) =>
  http<StudyPostResponse>('/api/v1/community/post/study', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

export const getSharePost = (postId: number) =>
  http<SharePostResponse>(`/api/v1/community/post/share/${postId}`);

export const patchSharePost = (postId: number, body: SharePostUpdateRequest, userId?: number) =>
  http<SharePostResponse>(`/api/v1/community/post/share/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const getStudyPost = (postId: number) =>
  http<StudyPostResponse>(`/api/v1/community/post/study/${postId}`);

export const patchStudyPost = (postId: number, body: StudyPostUpdateRequest, userId?: number) =>
  http<StudyPostResponse>(`/api/v1/community/post/study/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const joinStudyPost = (postId: number, userId: number) =>
  http<void>(`/api/v1/community/post/study/${postId}/join`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId }),
  });

function normalizeComments(raw: any): CommentResponse[] {
  if (Array.isArray(raw)) return raw as CommentResponse[];
  if (Array.isArray(raw?.items)) return raw.items as CommentResponse[];
  if (Array.isArray(raw?.data)) return raw.data as CommentResponse[];
  if (Array.isArray(raw?.item)) return raw.item as CommentResponse[];
  return [];
}

export const getComments = async (postId: number): Promise<CommentResponse[]> => {
  const raw = await http<any>(`/api/v1/community/post/${postId}/comments`); // ← comments 복수형 확인
  return normalizeComments(raw);
};

export const createComment = (
  user: number,
  post_id: number,
  content: string,
  parent_comment_id?: number,
) =>
  http<CommentResponse>(`/api/v1/community/post/${post_id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      user: user,
      content: content.trim(),
      parent_comment_id:
        typeof parent_comment_id === 'number' && parent_comment_id > 0 ? parent_comment_id : null,
    }),
  });

export const readLikeCount = (postId: number) =>
  http<{ count: number }>(`/api/v1/community/post/${postId}/likes`);

export const toggleLike = (postId: number, userId?: number) =>
  http<void>(`/api/v1/community/post/${postId}/like`, {
    method: 'POST',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const likeStatus = (postId: number, userId?: number) =>
  http<{ liked: boolean }>(`/api/v1/community/post/${postId}/like/status`, {
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const deletePost = (postId: number, userId?: number) =>
  http<void>(`/api/v1/community/post/${postId}`, {
    method: 'DELETE',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

//search
const SEARCH_ENDPOINT = '/api/v1/community/post/search';

export interface AllListCursorParams {
  q?: string;
  search_in?: SearchIn;
  cursor?: string | number;
  limit?: number;
  author_id?: string | number;
  date_from?: string;
  date_to?: string;
  badge?: string;
}

export type ListCursorItem = {
  id?: number;
  post_id?: number;
  title: string;
  content?: string;
  category: Exclude<Category, 'all'>;
  author_id: number;
  created_at: string;
  views?: number;
  badge?: string;
};

export interface AllListCursorResponse {
  count: number;
  next_cursor: string | number | null;
  items: ListCursorItem[];
}

const BASE_PATH = '/api/v1/community/post/all/list-cursor' as const;

function buildQuery(params: Record<string, unknown>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    usp.append(k, String(v));
  }
  const s = usp.toString();
  return s ? `?${s}` : '';
}

export function getAllListCursor(
  cursor: string | number | null | undefined,
  q?: string,
  limit?: number,
): Promise<AllListCursorResponse>; // 시그니처 1
export function getAllListCursor(params: AllListCursorParams): Promise<AllListCursorResponse>; // 시그니처 2
export function getAllListCursor(
  a: string | number | null | undefined | AllListCursorParams,
  q?: string,
  limit?: number,
): Promise<AllListCursorResponse> {
  const params: AllListCursorParams =
    typeof a === 'object' && a !== null ? a : { cursor: a ?? undefined, q, limit };

  const query = buildQuery({
    q: params.q,
    search_in: params.search_in,
    cursor: params.cursor,
    limit: params.limit ?? 20,
    author_id: params.author_id,
    date_from: params.date_from,
    date_to: params.date_to,
    badge: params.badge,
  });

  return http<AllListCursorResponse>(`${BASE_PATH}${query}`);
}

// 위클리 탑5
const TOP_WEEKLY_PATH: Record<TopCategory, string> = {
  study: '/api/v1/community/post/study/top-weekly',
  free: '/api/v1/community/post/free/top-weekly',
  share: '/api/v1/community/post/share/top-weekly',
};

export async function getTopWeekly(category: TopCategory, limit = 5): Promise<TopWeeklyResponse> {
  const path = TOP_WEEKLY_PATH[category];
  const url = `${path}?limit=${encodeURIComponent(limit)}`;
  return http<TopWeeklyResponse>(url);
}

export const getTopWeeklyStudy = (limit = 5) => getTopWeekly('study', limit);
export const getTopWeeklyFree = (limit = 5) => getTopWeekly('free', limit);
export const getTopWeeklyShare = (limit = 5) => getTopWeekly('share', limit);
