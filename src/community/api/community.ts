import { postJSON } from './http';
import type { BasePostPayload, CommentPayload, CommentResponse, PostResponse } from './types';

export function createFreePost(body: BasePostPayload) {
  return postJSON<BasePostPayload, PostResponse>('/api/community/post/free', body);
}

export function createSharePost(body: BasePostPayload) {
  return postJSON<BasePostPayload, PostResponse>('/api/community/post/share', body);
}

export function createStudyPost(body: BasePostPayload) {
  return postJSON<BasePostPayload, PostResponse>('/api/community/post/study', body);
}

export function addComment(postId: number, body: CommentPayload) {
  return postJSON<CommentPayload, CommentResponse>(`/api/community/post/${postId}/comment`, body);
}

export function joinStudy(postId: number, payload?: { note?: string }) {
  return postJSON<typeof payload, { joined: true; postId: number }>(
    `/api/community/post/study/${postId}/join`,
    payload ?? {},
  );
}
