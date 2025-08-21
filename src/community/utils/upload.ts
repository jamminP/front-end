export const BYTES_10MB = 10 * 1024 * 1024;

export const ALLOW_FREE = new Set(['image/png', 'image/jpeg']);
export const ALLOW_SHARE = new Set([
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

export function bytesToMB(n: number) {
  return (n / (1024 * 1024)).toFixed(2);
}

export function assertUploadLimits(files: File[]) {
  if (files.length > 10) throw new Error('파일은 최대 10개까지만 업로드할 수 있어요.');
  const total = files.reduce((a, f) => a + f.size, 0);
  if (total > BYTES_10MB) throw new Error('총 용량은 10MB 이하여야 합니다.');
}

export function assertFreeTypes(files: File[]) {
  const bad = files.find((f) => !ALLOW_FREE.has(f.type));
  if (bad) throw new Error('free 카테고리는 PNG/JPG만 업로드할 수 있어요.');
}

export function assertShareTypes(files: File[]) {
  const bad = files.find((f) => !ALLOW_SHARE.has(f.type));
  if (bad) throw new Error('share 카테고리는 PNG/JPG/PDF/DOCX만 업로드할 수 있어요.');
}

function extOf(name: string) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i).toLowerCase() : '';
}

function sanitizeBase(base: string) {
  const cleaned = base
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return cleaned || 'file';
}

export function sanitizeFilename(file: File): File {
  const ext = file.name.split('.').pop() ?? '';
  const base = file.name.replace(/\.[^/.]+$/, '');

  const cleaned = base
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9\s\-_]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const safeBase = cleaned || 'file';
  const safeName = `${safeBase}.${ext}`;

  return new File([file], safeName, { type: file.type });
}
