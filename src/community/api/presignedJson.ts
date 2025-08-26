import type { Cat } from '../utils/mime';
import { validateByCategory, pickContentType } from '../utils/mime';
import { getPresigned, attachUploaded } from '../api/attachments';
import { shortenFilename } from '../utils/filename';
import { http } from './http';

type CreateBody =
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

/** ?user= 제거, 서버는 세션 쿠키로 인증 */
export async function createPostJSON(body: CreateBody) {
  return http<any>(`/api/v1/community/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
}

export interface UploadResult {
  file: File;
  ok: boolean;
  key?: string;
  error?: string;
  uploadName?: string;
}

async function uploadWithPresignedPOST(
  file: File,
  presigned: { url: string; fields: Record<string, string> },
  onProgress?: (file: File, loaded: number, total: number) => void,
) {
  const form = new FormData();
  for (const [k, v] of Object.entries(presigned.fields)) form.append(k, v);
  form.append('file', file, file.name);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', presigned.url);

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable && onProgress) onProgress(file, evt.loaded, evt.total);
    };
    xhr.onerror = () => reject(new Error('스토리지 업로드 네트워크 오류'));
    xhr.ontimeout = () => reject(new Error('스토리지 업로드 타임아웃'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        let detail = '';
        try {
          const xml =
            xhr.responseXML || new DOMParser().parseFromString(xhr.responseText, 'application/xml');
          const code = xml?.getElementsByTagName('Code')[0]?.textContent || '';
          const msg = xml?.getElementsByTagName('Message')[0]?.textContent || '';
          detail = [code, msg].filter(Boolean).join(' - ');
        } catch {}
        console.error('S3 error status:', xhr.status, 'url:', xhr.responseURL);
        console.error('S3 error body:', xhr.responseText);
        reject(new Error(`스토리지 업로드 실패 (${xhr.status})${detail ? `: ${detail}` : ''}`));
      }
    };

    xhr.send(form);
  });

  const key = presigned.fields.key;
  const objectUrl = `${presigned.url.replace(/\/$/, '')}/${key}`;
  return { key, objectUrl };
}

/**  user, userId 제거. 세션 쿠키로 백엔드가 식별 */
export async function uploadWithPresignedJson(
  cat: Cat,
  post_id: number,
  files: File[],
  onProgress?: (file: File, loaded: number, total: number) => void,
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const file of files) {
    const valid = validateByCategory(cat, file);
    if (!valid.ok) {
      results.push({ file, ok: false, error: valid.reason });
      continue;
    }
    const content_type = pickContentType(file)!;
    const uploadName = shortenFilename(file.name, { maxTotal: 80, maxBase: 40 });

    try {
      const presigned = await getPresigned(
        cat,
        { post_id },
        { filename: uploadName, content_type },
      );

      if (!presigned?.fields || !presigned?.url) {
        throw new Error('유효하지 않은 presign 응답');
      }

      const r = await uploadWithPresignedPOST(file, presigned, onProgress);
      const key = r.key;

      await attachUploaded(cat, { post_id }, { key });

      results.push({ file, ok: true, key, uploadName });
    } catch (e: any) {
      results.push({ file, ok: false, error: e?.message || '업로드 실패' });
    }
  }

  return results;
}
