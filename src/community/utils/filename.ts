export function shortenFilename(
  original: string,
  opts: { maxTotal?: number; maxBase?: number } = {},
): string {
  const { maxTotal = 80, maxBase = 40 } = opts;

  const idx = original.lastIndexOf('.');
  const rawExt = idx >= 0 ? original.slice(idx + 1) : '';
  const ext = (rawExt || 'dat').toLowerCase();

  let base = idx > 0 ? original.slice(0, idx) : original;

  const SAFE = /[^A-Za-z0-9\uAC00-\uD7A3._\- ]+/g;

  base = base.normalize
    ? base.normalize('NFKC')
    : base
        .replace(SAFE, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[-_.]+|[-_.]+$/g, '');

  if (!base) base = 'file';

  // 유니크 suffix (충돌 방지)
  const suffix = Date.now().toString(36).slice(-6);
  // 우선 base를 잘라서 길이 제한 보장
  const baseTrimmed = base.slice(0, maxBase);

  let candidate = `${baseTrimmed}-${suffix}.${ext}`;
  if (candidate.length > maxTotal) {
    const over = candidate.length - maxTotal;
    const baseMax = Math.max(1, baseTrimmed.length - over);
    candidate = `${baseTrimmed.slice(0, baseMax)}-${suffix}.${ext}`;
  }
  return candidate;
}
