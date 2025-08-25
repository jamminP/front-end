import { http } from './http';
import type { Cat } from '../utils/mime';

export interface PresignedParams {
  post_id: number;
  user: number;
}
export interface PresignedBody {
  filename: string;
  content_type: string;
}
export interface PresignedResp {
  url: string;
  fields: Record<string, string>; // S3 presigned POST 필드
}

export interface AttachParams {
  post_id: number;
  user: number;
}
export interface AttachBody {
  key: string;
}

export async function getPresigned(
  cat: Cat,
  params: PresignedParams,
  body: PresignedBody,
): Promise<PresignedResp> {
  const { post_id, user } = params;
  const url = `/api/v1/community/post/${cat}/${post_id}/attachments/presigned?user=${user}`;
  return http<PresignedResp>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

export async function attachUploaded(
  cat: Cat,
  params: AttachParams,
  body: AttachBody,
): Promise<void> {
  const { post_id, user } = params;
  const url = `/api/v1/community/post/${cat}/${post_id}/attachments/attach?user=${user}`;
  return http<void>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}
