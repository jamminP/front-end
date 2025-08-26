export const toISOWithOffset = (d?: string) => {
  if (!d) return undefined;
  const offsetMin = -new Date().getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const pad = (n: number) => String(Math.floor(Math.abs(n))).padStart(2, '0');
  const hh = pad(offsetMin / 60);
  const mm = pad(offsetMin % 60);
  return `${d}T00:00:00${sign}${hh}:${mm}`;
};

export const toNumber = (v?: string | number) => {
  const n = typeof v === 'number' ? v : Number(v ?? '');
  return Number.isFinite(n) ? n : undefined;
};

export const compact = <T extends object>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== '')) as T;
