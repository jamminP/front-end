const BASE = import.meta.env.VITE_API_BASE_URL ?? 'https://backend.evida.site';
const REFRESH_URL = import.meta.env.VITE_API_REFRESH_URL ?? '/api/v1/auth/refresh';

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

let isRefreshing = false;
type RetryItem = {
  url: string;
  init: RequestInit & { _retry?: boolean };
  resolve: (v: any) => void;
  reject: (e: any) => void;
};
const failedQueue: RetryItem[] = [];

function processQueue(err?: any) {
  while (failedQueue.length) {
    const { url, init, resolve, reject } = failedQueue.shift()!;
    if (err) reject(err);
    else resolve(http(url, { ...init, _retry: true }));
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

async function refreshAccessToken(): Promise<string | null> {
  // fetch 사용 (순환 방지)
  const res = await fetch(REFRESH_URL.startsWith('http') ? REFRESH_URL : `${BASE}${REFRESH_URL}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const data = await res.text().catch(() => '');
    throw new HttpError(res.status, '토큰 갱신 실패', data || null);
  }
  const newToken = getCookie('access_token')?.trim() || null;
  if (newToken) setAccessToken(newToken);
  return newToken;
}

function parseServerMessage(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string') return data.trim() || null;
  return data.message ?? data.detail ?? data.error ?? data.msg ?? null;
}

export async function http<T>(
  url: string,
  init: RequestInit & { _retry?: boolean } = {},
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const isSimpleGet = method === 'GET' || method === 'HEAD';

  const h = new Headers(init.headers || {});
  if (!h.has('Accept')) h.set('Accept', 'application/json');
  if (!h.has('Authorization')) {
    const token = getAccessToken();
    if (token) h.set('Authorization', `Bearer ${token}`);
  }

  const body = init.body;
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const isBlob = typeof Blob !== 'undefined' && body instanceof Blob;
  const isURLSearch = typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;

  if (!isSimpleGet && body && !isFormData && !isBlob && !isURLSearch) {
    if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
  }

  const finalUrl = url.startsWith('http') ? url : `${BASE}${url}`;

  const doFetch = () =>
    fetch(finalUrl, {
      ...init,
      method,
      headers: h,
      credentials: init.credentials ?? 'include',
      redirect: init.redirect ?? 'follow',
    });

  let res = await doFetch();

  const ctype = res.headers.get('content-type') || '';
  const isJson = ctype.includes('application/json');

  if (!res.ok) {
    if (res.status === 401) {
      if (init._retry) {
        const errData = isJson
          ? await res.json().catch(() => null)
          : await res.text().catch(() => '');
        throw new HttpError(401, '세션이 만료되었습니다. 다시 로그인해 주세요.', errData);
      }

      // 이미 다른 요청이 갱신중이면 큐에 대기
      if (isRefreshing) {
        return new Promise<T>((resolve, reject) => {
          failedQueue.push({ url, init, resolve, reject });
        });
      }

      isRefreshing = true;
      try {
        await refreshAccessToken();
        processQueue();
        res = await fetch(finalUrl, {
          ...init,
          method,
          headers: (() => {
            const hh = new Headers(h);
            const token = getAccessToken();
            if (token) hh.set('Authorization', `Bearer ${token}`);
            return hh;
          })(),
          credentials: init.credentials ?? 'include',
          redirect: init.redirect ?? 'follow',
        });
        if (!res.ok) {
          const ct = res.headers.get('content-type') || '';
          const ij = ct.includes('application/json');
          const ed = ij ? await res.json().catch(() => null) : await res.text().catch(() => '');
          const msg = parseServerMessage(ed) ?? res.statusText;
          throw new HttpError(res.status, msg, ed);
        }
      } catch (refreshErr: any) {
        processQueue(refreshErr);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth:logout'));
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        const status = refreshErr?.status ?? 401;
        const data = refreshErr?.data ?? refreshErr;
        throw new HttpError(status, '세션이 만료되었습니다. 다시 로그인해 주세요.', data);
      } finally {
        isRefreshing = false;
      }
    } else {
      const errorData = isJson
        ? await res.json().catch(() => null)
        : await res.text().catch(() => '');
      const msg = parseServerMessage(errorData) ?? res.statusText;
      console.error('[HTTP ERROR]', res.status, res.statusText, errorData);
      throw new HttpError(res.status, msg, errorData);
    }
  }

  if (import.meta.env.DEV) {
    console.debug('[HTTP]', init?.method ?? 'GET', url);
    if (init?.body) {
      try {
        console.debug(
          '[HTTP BODY]',
          typeof init.body === 'string' ? JSON.parse(init.body) : init.body,
        );
      } catch {}
    }
  }

  if (res.status === 204) return undefined as unknown as T;
  return (isJson ? await res.json() : await res.text()) as T;
}
