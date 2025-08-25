export function countCoreChars(input: string): number {
  const core = (input || '').replace(/\s+/g, '');
  let count = 0;
  for (let i = 0; i < core.length; i++) {
    const c = core.charCodeAt(i);
    if (c >= 0xd800 && c <= 0xdbff && i + 1 < core.length) {
      const d = core.charCodeAt(i + 1);
      if (d >= 0xdc00 && d <= 0xdfff) i++;
    }
    count++;
  }
  return count;
}
