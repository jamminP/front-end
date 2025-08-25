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
    'image/png',
    'image/jpeg',
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
  share:
    'image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};
