import { http } from './http';
import type {
  PostCategory,
  CursorPage,
  ListItem,
  PostDetail,
  TopCategory,
  TopWeeklyResponse,
  CommentResponse,
  CommentTreeItem,
  GETCommentResponse,
  GetCommentsParams,
  PatchPostParams,
  PatchPostRequest,
  PatchCommentsParams,
  PatchCommentsRequest,
  DeletePostParams,
  DeleteCommentParams,
} from './types';

export const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';
const LIST_ENDPOINT = '/api/v1/community/post/list';
const DETAIL_ENDPOINT = (postId: number) => `/api/v1/community/post/${postId}`;
const CREATE_POST = `${BASE}/api/v1/community/post`;

export type CreatePostCategory = 'free' | 'share' | 'study';

export function getPostId(item: ListItem): number {
  if (item.category === 'free') return item.free_post_id;
  if (item.category === 'share') return item.share_post_id;
  return item.study_post_id;
}

export interface GetPostListParams {
  category: PostCategory;
  cursor?: number | null;
  limit?: number;
}

export async function getPostList(params: GetPostListParams): Promise<CursorPage<ListItem>> {
  const qs = new URLSearchParams();
  qs.set('category', params.category);
  if (params.cursor != null) qs.set('cursor', String(params.cursor)); // 0 허용
  if (params.limit != null) qs.set('limit', String(params.limit));

  return http<CursorPage<ListItem>>(`${LIST_ENDPOINT}?${qs.toString()}`);
}

export async function getPostDetail(postId: number): Promise<PostDetail> {
  return http<PostDetail>(DETAIL_ENDPOINT(postId));
}

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

export type ApiId = { id?: number; post_id?: number };

export interface CreatePostBase {
  title: string;
  content: string;
  category: CreatePostCategory;
  user_id: number;
}

export type FreePostRequest = Omit<CreatePostBase, 'category'>;
export type SharePostRequest = Omit<CreatePostBase, 'category'>;
export type StudyPostRequest = Omit<CreatePostBase, 'category'> & {
  recruit_start: string;
  recruit_end: string;
  study_start: string;
  study_end: string;
  max_member: number;
};

export interface CreatePostResult {
  post_id: number;
}

async function postCreate(user: number, body: Record<string, any>): Promise<CreatePostResult> {
  const qs = new URLSearchParams({ user: String(user) }).toString();
  const res = await http<any>(`${CREATE_POST}?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 세션/쿠키 사용하는 경우 유지
    body: JSON.stringify({ ...body, user_id: user }),
  });

  const data = res as any;
  const pid: unknown = data?.post_id ?? data?.id ?? data?.postId;
  if (typeof pid !== 'number' || !Number.isFinite(pid)) {
    throw new Error('Create post: invalid post_id in response');
  }
  return { post_id: pid };
}

// create Free
export function createFreePost(user: number, body: FreePostRequest): Promise<CreatePostResult>;
export function createFreePost(
  body: FreePostRequest & { user_id: number },
): Promise<CreatePostResult>;
export function createFreePost(
  a: number | (FreePostRequest & { user_id: number }),
  b?: FreePostRequest,
): Promise<CreatePostResult> {
  const user = typeof a === 'number' ? a : a.user_id;
  const payload = (typeof a === 'number' ? b! : a) as FreePostRequest;
  return postCreate(user, { ...payload, category: 'free' as const });
}

// create Share
export function createSharePost(user: number, body: SharePostRequest): Promise<CreatePostResult>;
export function createSharePost(
  body: SharePostRequest & { user_id: number },
): Promise<CreatePostResult>;
export function createSharePost(
  a: number | (SharePostRequest & { user_id: number }),
  b?: SharePostRequest,
): Promise<CreatePostResult> {
  const user = typeof a === 'number' ? a : a.user_id;
  const payload = (typeof a === 'number' ? b! : a) as SharePostRequest;
  return postCreate(user, { ...payload, category: 'share' as const });
}

// create Study
export function createStudyPost(user: number, body: StudyPostRequest): Promise<CreatePostResult>;
export function createStudyPost(
  body: StudyPostRequest & { user_id: number },
): Promise<CreatePostResult>;
export function createStudyPost(
  a: number | (StudyPostRequest & { user_id: number }),
  b?: StudyPostRequest,
): Promise<CreatePostResult> {
  const user = typeof a === 'number' ? a : a.user_id;
  const payload = (typeof a === 'number' ? b! : a) as StudyPostRequest;
  return postCreate(user, { ...payload, category: 'study' as const });
}

export function getComments(
  post_id: number,
  params: GetCommentsParams = {},
): Promise<GETCommentResponse> {
  const { order = 'id', offset = 0, limit = 50 } = params;
  const qs = new URLSearchParams({
    order,
    offset: String(offset),
    limit: String(limit),
  });

  return http<GETCommentResponse>(`/api/v1/community/post/${post_id}/comments?${qs}`, {
    method: 'GET',
    credentials: 'include',
  });
}

export interface CreateCommentBody {
  user: number;
  content: string;
  parent_comment_id: number | null;
}

export async function createComment(
  post_id: number,
  payload: CreateCommentBody,
): Promise<CommentResponse> {
  const qs = new URLSearchParams({ user: String(payload.user) }).toString();

  const body: Record<string, unknown> = { content: payload.content };
  if (payload.parent_comment_id != null && payload.parent_comment_id > 0) {
    body.parent_comment_id = payload.parent_comment_id;
  }

  const res = await fetch(`/api/v1/community/post/${post_id}/comment?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`createComment failed: ${res.status} ${text}`);
  }
  return res.json() as Promise<CommentResponse>;
}

export async function listComments(postId: number): Promise<CommentTreeItem[]> {
  try {
    return await http<CommentTreeItem[]>(`/api/v1/community/post/${postId}/comments`);
  } catch (e: any) {
    if (String(e?.message || '').startsWith('404')) return [];
    throw e;
  }
}

//patch post / comment
export const patchPost = (params: PatchPostParams, body: PatchPostRequest) =>
  http<any>(`/api/v1/community/post/${params.post_id}?user=${params.user}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const patchComment = (
  post_id: number,
  params: PatchCommentsParams,
  body: PatchCommentsRequest,
) =>
  http<any>(`/api/v1/community/comment/${params.comment_id}?user=${params.user}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

//delete
export const deletePost = (params: DeletePostParams) =>
  http<void>(`/api/v1/community/post/${params.post_id}?user=${params.user}`, {
    method: 'DELETE',
  });

export const deleteComment = (params: DeleteCommentParams) =>
  http<void>(`/api/v1/community/post/${params.comment_id}?user=${params.user}`, {
    method: 'DELETE',
  });
