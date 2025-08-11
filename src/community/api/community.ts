import { http } from './http';
import {
  FreePostRequestDTO,
  FreePostResponseDTO,
  FreePostUpdateRequestDTO,
  SharePostRequestDTO,
  SharePostResponseDTO,
  SharePostUpdateRequestDTO,
  StudyPostRequestDTO,
  StudyPostResponseDTO,
  StudyPostUpdateRequestDTO,
  CommentResponseDTO,
} from './types';

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
  http<unknown>(`/api/community/post/${postId}/likes`);

export const toggleLike = (postId: number, userId?: number) =>
  http<void>(`/api/community/post/${postId}/like`, {
    method: 'POST',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const likeStatus = (postId: number, userId?: number) =>
  http<unknown>(`/api/community/post/${postId}/like/status`, {
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });

export const deletePost = (postId: number, userId?: number) =>
  http<void>(`/api/community/post/${postId}`, {
    method: 'DELETE',
    headers: { ...(userId ? { x_user_id: String(userId) } : {}) },
  });
