import type { Cat } from '../utils/mime';
import { validateByCategory, pickContentType } from '../utils/mime';
import { getPresigned, attachUploaded } from '../api/attachments';
import { shortenFilename } from '../utils/filename';

export interface UploadResult {
  file: File;
  ok: boolean;
  key?: string;
  error?: string;
  uploadName?: string;
}

export async function uploadWithPresignedJson(
  cat: Cat,
  params: { post_id: number; user: number },
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
      const presigned = await getPresigned(cat, params, {
        filename: uploadName,
        content_type,
      });

      const form = new FormData();
      Object.entries(presigned.fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', file);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', presigned.url);
        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && onProgress) onProgress(file, evt.loaded, evt.total);
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`스토리지 업로드 실패: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('스토리지 업로드 네트워크 오류'));
        xhr.send(form);
      });

      const key = presigned.fields.key;
      await attachUploaded(cat, params, { key });

      results.push({ file, ok: true, key, uploadName });
    } catch (e: any) {
      results.push({ file, ok: false, error: e?.message || '업로드 실패' });
    }
  }

  return results;
}
