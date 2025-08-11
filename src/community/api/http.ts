export async function postJSON<TReq, TRes>(
  url: string,
  body: TReq,
  init?: RequestInit,
): Promise<TRes> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'applocation/json' },
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || `POST ${url} failed (${res.status})`);
  }
  return res.json() as Promise<TRes>;
}
