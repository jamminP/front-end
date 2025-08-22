import { http } from './http';
import type {
  PostCategory,
  CursorPage,
  ListItem,
  PostDetail,
  TopCategory,
  TopWeeklyResponse,
} from './types';

const LIST_ENDPOINT = '/api/v1/community/post/list';
const DETAIL_ENDPOINT = (postId: number) => `/api/v1/community/post/${postId}`;

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
