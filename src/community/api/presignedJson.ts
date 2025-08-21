import { sanitizeFilename } from '../utils/upload';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';
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
  const { category, ...payload } = body as any;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error('[createPostJSON]', url, res.status, text);
    throw new Error(`createPostJSON ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

type PresignReq = { filename: string; content_type: string };

type PresignRaw = {
  key: string;
  url: string;
  fields: Record<string, string>;
  expires_in: number;
};

export type PresignRes = {
  key: string;
  url: string;
  fields: Record<string, string>;
  expiresIn: number;
};

function normalizePresign(r: PresignRaw): PresignRes {
  return {
    key: r.key,
    url: r.url,
    fields: r.fields || {},
    expiresIn: r.expires_in ?? 0,
  };
}

async function requestPresignedJSON(
  category: Exclude<Category, 'study'>,
  postId: number,
  file: File,
): Promise<PresignRes> {
  const url = `${CREATE_PREFIX}/${category}/${postId}/attachments/presigned`;
  const body: PresignReq = {
    filename: file.name,
    content_type: file.type || 'application/octet-stream',
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error('[presigned]', url, res.status, text);
    throw new Error(`presigned ${res.status}: ${text}`);
  }
  const json = text ? JSON.parse(text) : {};
  return normalizePresign(json as PresignRaw);
}

async function postPolicyToS3(p: PresignRes, file: File) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(p.fields)) {
    fd.append(k, v);
  }
  fd.append('file', file);

  const res = await fetch(p.url, { method: 'POST', body: fd });
  if (!res.ok) {
    const t = await res.text();
    console.error('[S3 POST ERR]', res.status, t);
    throw new Error(`S3 POST 실패: ${res.status} ${t}`);
  }
}

async function attachJSON(
  category: Exclude<Category, 'study'>,
  postId: number,
  body: {
    key: string;
    file_name: string;
    content_type: string;
    file_size: number;
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
  if (!res.ok) {
    console.error('[attach]', url, res.status, text);
    throw new Error(`attach ${res.status}: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

export async function uploadWithPresignedJson(
  category: Exclude<Category, 'study'>,
  postId: number,
  files: File[],
): Promise<string[]> {
  const keys: string[] = [];
  await Promise.all(
    files.map(async (raw, i) => {
      const file = sanitizeFilename(raw);

      const p = await requestPresignedJSON(category, postId, file);

      await postPolicyToS3(p, file);

      await attachJSON(category, postId, {
        key: p.key,
        file_name: file.name,
        content_type: file.type || 'application/octet-stream',
        file_size: file.size,
        order: i,
      });

      keys.push(p.key);
    }),
  );
  return keys;
}
