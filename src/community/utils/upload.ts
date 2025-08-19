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
