import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { getCookie } from './cookies';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

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

  if (cookieToken) {
    headers.set('Authorization', `Bearer ${cookieToken}`);
    config.headers = headers;
  } else {
    if (headers.has('Authorization')) headers.delete('Authorization');
    config.headers = headers;
  }

  return config;
}

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined' && !navigator.onLine) {
    return Promise.reject(new HttpError('오프라인 상태입니다.', { isNetwork: true }));
  }
  return attachAuthHeader(config);
});

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
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

    return Promise.reject(
      new HttpError(msg, {
        status: error.response?.status,
        data: error.response?.data,
        isNetwork: !error.response,
      }),
    );
  },
);
