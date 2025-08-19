type HttpInitX = RequestInit & { withCreds?: boolean };

const BASE = import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');

export async function http<T>(path: string, init: HttpInitX = {}): Promise<T> {
  const { withCreds = false, ...rest } = init;
  const method = (rest.method ?? 'GET').toUpperCase();

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(rest.headers as Record<string, string> | undefined),
  };

  let body = (rest as any).body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] ||= 'application/json';
    if (headers['Content-Type'].includes('application/json')) body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    method,
    headers,
    body,
    credentials: withCreds ? 'include' : 'omit',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText}${text ? ` :: ${text}` : ''}`);
  }
  if (res.status === 204) return undefined as unknown as T;

  const ct = res.headers.get('content-type') || '';
  return (ct.includes('application/json') ? await res.json() : await res.text()) as T;
}
