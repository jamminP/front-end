import { http } from './http';
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
  Post,
  AllPostResponseDTO,
  SearchScope,
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
    return await http<CommentTreeItem[]>(`/api/community/post/${postId}/comments`);
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

//search
const SEARCH_ENDPOINT = '/api/community/post/search';

export interface SearchCursorParams {
  q: string;
  scope: SearchScope;
  category?: Category;
  cursor?: number | null;
  size?: number;
}

export async function searchPostsCursor(params: SearchCursorParams) {
  const { q, scope, category = 'all', cursor, size } = params;
  const url = `${SEARCH_ENDPOINT}${qs({ q, scope, category, cursor, size })}`;
  const raw = await http<any>(url);
  return normalizeCursorPage<AllPostResponseDTO>(raw);
}

type _AllDto = AllPostResponseDTO;
type _Post = Post;

const _toPost = (dto: _AllDto): _Post => ({
  post_id: dto.id,
  title: dto.title ?? '',
  content: dto.content ?? '',
  author_id: dto.author_id,
  author: `user#${dto.author_id}`,
  category: dto.category,
  created_at: dto.created_at,
  views: (dto as any).views ?? 0,
  likes: (dto as any).like_count ?? 0,
  comments: (dto as any).comment_count ?? 0,
});

export async function searchPostsAllPages(
  params: Omit<SearchCursorParams, 'cursor'>,
): Promise<Post[]> {
  const acc: _AllDto[] = [];
  let cursor: number | null | undefined = undefined;

  while (true) {
    const page = await searchPostsCursor({ ...params, cursor });
    acc.push(...page.items);
    if (page.nextCursor == null) break;
    cursor = page.nextCursor;
  }

  const mapped = acc.map(_toPost);
  mapped.sort((a, b) => new Date(b.created_at).valueOf() - new Date(a.created_at).valueOf());
  return mapped;
}
