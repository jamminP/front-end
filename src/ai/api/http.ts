import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from './cookies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const REFRESH_URL = `${BASE_URL}/api/v1/users/auth/refresh`;
const AI_PATH_PREFIX = '/ai';

export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  withCredentials: true,
});

export class HttpError extends Error {
  status?: number;
  data?: unknown;
  isNetwork: boolean;
  constructor(message: string, opts?: { status?: number; data?: unknown; isNetwork?: boolean }) {
    super(message);
    this.name = 'HttpError';
    this.status = opts?.status;
    this.data = opts?.data;
    this.isNetwork = !!opts?.isNetwork;
  }
}

function attachAuthHeader(config: InternalAxiosRequestConfig) {
  const headers =
    config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers);
  const cookieToken = getCookie('access_token')?.trim?.() || null;
  if (cookieToken) headers.set('Authorization', `Bearer ${cookieToken}`);
  else if (headers.has('Authorization')) headers.delete('Authorization');
  config.headers = headers;
  return config;
}

function normalizeUrl(config: InternalAxiosRequestConfig) {
  if (!config.url) return config;
  const i = config.url.indexOf('?');
  const p = i >= 0 ? config.url.slice(0, i) : config.url;
  const q = i >= 0 ? config.url.slice(i) : '';
  config.url = p.replace(/\/+$/, '') + q;
  return config;
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined' && !navigator.onLine) {
    return Promise.reject(new HttpError('오프라인 상태입니다.', { isNetwork: true }));
  }
  return attachAuthHeader(normalizeUrl(config));
});

let isRefreshing = false;
type Queued = { resolve: (v?: any) => void; reject: (e: any) => void; config: any };
let failedQueue: Queued[] = [];
let hasReloadedAfterRefresh = false;

function processQueue(error: any = null) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else resolve(http(config));
  });
  failedQueue = [];
}

function maybeReloadAi() {
  if (
    typeof window !== 'undefined' &&
    !hasReloadedAfterRefresh &&
    window.location.pathname.startsWith(AI_PATH_PREFIX)
  ) {
    hasReloadedAfterRefresh = true;
    setTimeout(() => window.location.reload(), 0);
  }
}

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const data = error.response?.data as any;
    const serverMsg =
      data?.message ??
      data?.detail ??
      data?.error ??
      data?.msg ??
      (typeof data === 'string' ? data.trim() || null : null);
    const msg =
      serverMsg ??
      (error.code === 'ECONNABORTED'
        ? '요청 시간이 초과되었습니다.'
        : !error.response
          ? '네트워크 오류가 발생했습니다.'
          : `요청 실패 (HTTP ${error.response.status})`);

    if (error.response?.status !== 401 || !originalRequest) {
      throw new HttpError(msg, {
        status: error.response?.status,
        data,
        isNetwork: !error.response,
      });
    }

    if (originalRequest._retry) {
      throw new HttpError(msg, { status: 401, data, isNetwork: false });
    }
    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    isRefreshing = true;
    try {
      await axios.post(REFRESH_URL, {}, { withCredentials: true });

      const newToken = getCookie('access_token')?.trim?.();
      if (newToken) http.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      processQueue();
      maybeReloadAi();
      return http(originalRequest);
    } catch (refreshErr: any) {
      processQueue(refreshErr);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      throw new HttpError('세션이 만료되었습니다. 다시 로그인해 주세요.', {
        status: 401,
        data: refreshErr?.response?.data,
        isNetwork: !refreshErr?.response,
      });
    } finally {
      isRefreshing = false;
    }
  },
);
