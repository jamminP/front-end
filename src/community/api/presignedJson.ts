import { sanitizeFilename } from '../utils/upload';

const BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend.evida.site';

const CREATE_PREFIX = `${BASE}/api/v1/community/post`;

export type Category = 'free' | 'share' | 'study';
export type ApiId = { id?: number; post_id?: number } & Record<string, unknown>;

export type CreatePostJSONBody =
  | { category: 'free' | 'share'; title: string; content: string; user_id: number }
  | {
      category: 'study';
      title: string;
      content: string;
      user_id: number;
      recruit_start?: string;
      recruit_end?: string;
      study_start?: string;
      study_end?: string;
      max_member?: number;
    };

export async function createPostJSON(body: CreatePostJSONBody): Promise<ApiId> {
  const url = `${CREATE_PREFIX}/${body.category}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`createPostJSON ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

export type PresignReq = { filename: string; contentType: string; size: number };
export type PresignRes = {
  uploadUrl: string;
  objectKey: string;
  headers?: Record<string, string>;
};

async function requestPresignedJSON(
  category: Exclude<Category, 'study'>,
  postId: number,
  body: PresignReq,
): Promise<PresignRes> {
  const url = `${CREATE_PREFIX}/${category}/${postId}/attachments/presigned`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`presigned ${res.status}: ${text}`);
  return (text ? JSON.parse(text) : {}) as PresignRes;
}

async function attachJSON(
  category: Exclude<Category, 'study'>,
  postId: number,
  body: {
    objectKey: string;
    filename: string;
    size: number;
    contentType: string;
    order: number;
  },
) {
  const url = `${CREATE_PREFIX}/${category}/${postId}/attachments/attach`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`attach ${res.status}: ${text}`);
  return text ? JSON.parse(text) : {};
}

async function putToS3Binary(p: PresignRes, file: File) {
  const headers = new Headers({
    'Content-Type': file.type || 'application/octet-stream',
  });
  if (p.headers) for (const [k, v] of Object.entries(p.headers)) headers.set(k, v);
  const r = await fetch(p.uploadUrl, { method: 'PUT', headers, body: file });
  if (!r.ok) throw new Error(`S3 PUT 실패: ${r.status}`);
}

export async function uploadWithPresignedJson(
  category: Exclude<Category, 'study'>,
  postId: number,
  files: File[],
): Promise<string[]> {
  const objectKeys: string[] = [];

  await Promise.all(
    files.map(async (raw, i) => {
      const file = sanitizeFilename(raw);

      const p = await requestPresignedJSON(category, postId, {
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        size: file.size,
      });

      await putToS3Binary(p, file);

      await attachJSON(category, postId, {
        objectKey: p.objectKey,
        filename: file.name,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
        order: i,
      });

      objectKeys.push(p.objectKey);
    }),
  );

  return objectKeys;
}
