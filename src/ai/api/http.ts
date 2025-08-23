import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

// axios 인스턴스
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// 토큰 기반 세팅시 사용 예정.
export function setAuthToken(token?: string) {
  if (token) http.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete http.defaults.headers.common.Authorization;
}

// 에러 추출 코드
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as any;
    const serverMsg =
      data?.message ??
      data?.detail ??
      data?.error ??
      data?.msg ??
      (typeof data === 'string' ? data.trim() || null : null);

    if (serverMsg) return serverMsg;

    if (error.code === 'ECONNABORTED') return '요청 시간이 초과되었습니다.';
    if (!error.response) return '네트워크 오류가 발생했습니다.';
    return `요청 실패 (HTTP ${error.response.status})`;
  }

  return (error as Error)?.message ?? '알 수 없는 오류가 발생했습니다.';
}

// 에러 클래스 보기 편하도록 수정
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

// 요청 인터셉터
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (import.meta.env.DEV) {
    const envToken = (import.meta.env as any).VITE_DEV_ACCESS_TOKEN?.trim?.();
    const lsToken = localStorage.getItem('dev_access_token')?.trim?.();
    const token = envToken || lsToken;

    if (token) {
      // headers가 AxiosHeaders일 수도/아닐 수도 있으므로 안전하게 래핑
      const headers =
        config.headers instanceof AxiosHeaders ? config.headers : new AxiosHeaders(config.headers);

      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers; // 타입 OK
    }
  }

  if (typeof window !== 'undefined' && !navigator.onLine) {
    return Promise.reject(new HttpError('오프라인 상태입니다.', { isNetwork: true }));
  }
  return config;
});

// 응답/에러 인터셉터
http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const message = extractErrorMessage(error);
    const status = error.response?.status;
    const data = error.response?.data;

    return Promise.reject(
      new HttpError(message, {
        status,
        data,
        isNetwork: !error.response,
      }),
    );
  },
);
