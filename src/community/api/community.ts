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
  Post,
  AllPostResponse,
  SearchIn,
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

async function getListCursor<T>(category: Category, cursor: number | null | undefined, q?: string) {
  const url = `${pathForCursor(category)}${qs({ cursor, q })}`;
  const res = await http<any>(url);
  return normalizeCursorPage<T>(res);
}

export const getFreeListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<FreePostResponse>('free', cursor, q);

export const getShareListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<SharePostResponse>('share', cursor, q);

export const getStudyListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<StudyPostResponse>('study', cursor, q);

export const getAllListCursor = (cursor: number | null | undefined, q?: string) =>
  getListCursor<any>('all', cursor, q);

export type AnyPostResponse = FreePostResponse | SharePostResponse | StudyPostResponse;

export const createFreePost = (body: FreePostRequest) =>
  http<FreePostResponse>('/api/v1/community/post/free', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

export const getFreePost = (postId: number) =>
  http<FreePostResponse>(`/api/v1/community/post/free/${postId}`);

export const patchFreePost = (postId: number, body: FreePostUpdateRequest, userId?: number) =>
  http<FreePostResponse>(`/api/v1/community/post/free/${postId}`, {
    method: 'PATCH',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
    body: JSON.stringify(body),
  });

export const createSharePost = (body: SharePostRequest) =>
  http<SharePostResponse>('/api/v1/community/post/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
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

export const createStudyPost = (body: StudyPostRequest) =>
  http<StudyPostResponse>('/api/v1/community/post/study', {
    method: 'POST',
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

export const createComment = (postId: number, content: string, userId: number, parentId?: number) =>
  http<CommentResponse>(`/api/v1/community/post/${postId}/comment`, {
    method: 'POST',
    body: JSON.stringify({
      post_id: postId,
      content,
      user_id: userId,
      parent_id: parentId ?? null,
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

export interface SearchCursorParams {
  q: string;
  scope: SearchIn;
  category?: Category;
  cursor?: number | null;
  size?: number;
}

export async function searchPostsCursor(params: SearchCursorParams) {
  const { q, scope, category = 'all', cursor, size } = params;
  const url = `${SEARCH_ENDPOINT}${qs({ q, scope, category, cursor, size })}`;
  const raw = await http<any>(url);
  return normalizeCursorPage<AllPostResponse>(raw);
}

type _All = AllPostResponse;
type _Post = Post;

const toNum = (v: unknown): number => (v == null ? 0 : typeof v === 'number' ? v : Number(v) || 0);

export const toPost = (src: _All): _Post => ({
  post_id: src.id,
  title: src.title ?? '',
  content: src.content ?? '',
  author_id: src.author_id,
  author: `user#${src.author_id}`,
  category: src.category,
  created_at: src.created_at,
  views: toNum((src as any).views ?? (src as any).view_count),
  likes: toNum((src as any).like_count),
  comments: toNum((src as any).comment_count),
});

export async function searchPostsAllPages(
  params: Omit<SearchCursorParams, 'cursor'>,
): Promise<Post[]> {
  const acc: _All[] = [];
  let cursor: number | null | undefined = undefined;

  while (true) {
    const page = await searchPostsCursor({ ...params, cursor });
    acc.push(...page.items);
    if (page.nextCursor == null) break;
    cursor = page.nextCursor;
  }

  const mapped = acc.map(toPost);
  mapped.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());
  return mapped;
}
