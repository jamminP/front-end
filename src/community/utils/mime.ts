export type Cat = 'free' | 'share';

const EXT_TO_MIME: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const ALLOWED_BY_CAT: Record<Cat, string[]> = {
  free: ['image/png', 'image/jpeg'],
  share: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
};

export function pickContentType(file: File): string | null {
  const mime = file.type || EXT_TO_MIME[file.name.split('.').pop()?.toLowerCase() || ''] || '';
  return mime || null;
}

export function validateByCategory(cat: Cat, file: File): { ok: boolean; reason?: string } {
  const ct = pickContentType(file);
  if (!ct) return { ok: false, reason: '알 수 없는 파일 형식' };
  if (!ALLOWED_BY_CAT[cat].includes(ct)) {
    return {
      ok: false,
      reason: `${cat === 'free' ? '자유' : '자료공유'} 게시판에서 허용되지 않는 형식`,
    };
  }
  return { ok: true };
}

export const ACCEPT_ATTR: Record<Cat, string> = {
  free: 'image/png,image/jpeg',
  share: 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const BYTES_10MB = 10 * 1024 * 1024;
export function assertUploadLimits(files: File[], maxFiles = 10, maxBytes = BYTES_10MB) {
  if (files.length > maxFiles) {
    throw new Error(`파일은 최대 ${maxFiles}개까지만 업로드할 수 있어요.`);
  }
  const total = files.reduce((a, f) => a + f.size, 0);
  if (total > maxBytes) {
    const mb = (total / (1024 * 1024)).toFixed(2);
    throw new Error(
      `총 용량은 ${(maxBytes / (1024 * 1024)).toFixed(0)}MB 이하여야 합니다. (현재 ${mb}MB)`,
    );
  }
}

export function assertFreeTypes(files: File[]) {
  const allow = new Set(['image/png', 'image/jpeg']);
  const bad = files.find((f) => !allow.has(pickContentType(f)!));
  if (bad) throw new Error('PNG 또는 JPG만 업로드할 수 있어요.');
}

export function assertShareTypes(files: File[]) {
  const allow = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]);
  const bad = files.find((f) => !allow.has(pickContentType(f)!));
  if (bad) throw new Error('허용되지 않는 파일 형식이 있어요. (pdf, docx만 가능)');
}
