// /src/Community/api/communityUpload.ts
const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';

export type Category = 'free' | 'share' | 'study';

export interface CreatePostBody {
  title: string;
  content: string;
  category: Category;
  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
}

type PresignReq = {
  filename: string;
  contentType: string;
  size: number;
};

type PresignRes = {
  uploadUrl: string;
  objectKey: string;
  headers?: Record<string, string>;
};

type AttachReq = {
  objectKey: string;
  filename: string;
  size: number;
  contentType: string;
  order: number;
};

export async function createPost(body: CreatePostBody) {
  const res = await fetch(`${BASE}/api/v1/community/post/${body.category}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`글 생성 실패(${res.status})`);
  return res.json() as Promise<{ post_id: number } & Record<string, unknown>>;
}

export async function presignFree(postId: number, body: PresignReq) {
  const res = await fetch(`${BASE}/api/v1/community/post/free/${postId}/attachments/presigned`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`presigned 발급 실패(${res.status})`);
  return res.json() as Promise<PresignRes>;
}

export async function presignShare(postId: number, body: PresignReq) {
  const res = await fetch(`${BASE}/api/v1/community/post/share/${postId}/attachments/presigned`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`presigned 발급 실패(${res.status})`);
  return res.json() as Promise<PresignRes>;
}

export async function uploadToS3(p: PresignRes, file: File) {
  const headers = new Headers({
    'Content-Type': file.type || 'application/octet-stream',
    ...(p.headers ?? {}),
  });
  const res = await fetch(p.uploadUrl, { method: 'PUT', headers, body: file });
  if (!res.ok) throw new Error(`S3 업로드 실패(${res.status})`);
}

export async function attachFree(postId: number, body: AttachReq) {
  const res = await fetch(`${BASE}/api/v1/community/post/free/${postId}/attachments/attach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`attach 실패(${res.status})`);
  return res.json();
}

export async function attachShare(postId: number, body: AttachReq) {
  const res = await fetch(`${BASE}/api/v1/community/post/share/${postId}/attachments/attach`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`attach 실패(${res.status})`);
  return res.json();
}

export async function uploadAndAttach(params: {
  category: 'free' | 'share';
  postId: number;
  files: File[];
}) {
  const { category, postId, files } = params;

  const results = await Promise.all(
    files.map(async (file, i) => {
      const presign =
        category === 'free'
          ? await presignFree(postId, {
              filename: file.name,
              contentType: file.type,
              size: file.size,
            })
          : await presignShare(postId, {
              filename: file.name,
              contentType: file.type,
              size: file.size,
            });

      await uploadToS3(presign, file);

      return category === 'free'
        ? await attachFree(postId, {
            objectKey: presign.objectKey,
            filename: file.name,
            size: file.size,
            contentType: file.type,
            order: i,
          })
        : await attachShare(postId, {
            objectKey: presign.objectKey,
            filename: file.name,
            size: file.size,
            contentType: file.type,
            order: i,
          });
    }),
  );

  return results;
}
