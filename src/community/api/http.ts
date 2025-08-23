const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';

let accessToken: string | null = null;

export const setAccessToken = (t: string | null) => {
  accessToken = t;
};
export const getAccessToken = () => accessToken;

export class HttpError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data: unknown,
  ) {
    super(`HTTP ${status} ${statusText}`);
  }
}

export async function http<T>(url: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const isSimpleGet = method === 'GET' || method === 'HEAD';

  const h = new Headers(init.headers || {});
  if (!h.has('Accept')) h.set('Accept', 'application/json');
  if (!h.has('Authorization')) {
    const token = getAccessToken();
    if (token) h.set('Authorization', `Bearer ${token}`);
  }

  const body = init.body;
  const isJsonString = typeof body === 'string';
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
  const isURLSearch = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

  if (!isSimpleGet && body && !isFormData && !isBlob && !isURLSearch) {
    if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  }

  const res = await fetch(url.startsWith('http') ? url : `${BASE}${url}`, {
    ...init,
    method,
    headers: h,
    credentials: init.credentials ?? 'include',
    redirect: init.redirect ?? 'follow',
  });

  const ctype = res.headers.get('content-type') || '';
  const isJson = ctype.includes('application/json');

  if (!res.ok) {
    const errorData = isJson
      ? await res.json().catch(() => null)
      : await res.text().catch(() => '');
    console.error('[HTTP ERROR]', res.status, res.statusText, errorData);
    throw new HttpError(res.status, res.statusText, errorData);
  }

  if (import.meta.env.DEV) {
    console.debug('[HTTP]', init?.method ?? 'GET', url);
    if (init?.body) {
      try {
        console.debug('[HTTP BODY]', JSON.parse(init.body as string));
      } catch {}
    }
  }

  if (res.status === 204) return undefined as unknown as T;
  return (isJson ? await res.json() : await res.text()) as T;
}
