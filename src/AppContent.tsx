import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import axios, { AxiosError } from 'axios';

// 컴포넌트 외부 전역 변수
let isRefreshing = false;

// 401 발생 요청 대기 큐
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
  originalRequest: any;
}[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else {
      resolve(axios(originalRequest));
    }
  });
  failedQueue = [];
};

export default function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  // 로컬에서 로그인 상태 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuthData(JSON.parse(savedUser));
    }
  }, [setAuthData]);

  // 새창: OAuth 등에서 부모창에 데이터 전달
  useEffect(() => {
    if (!window.opener) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
          withCredentials: true,
        });
        // 부모창에 전달
        window.opener.postMessage({ user: res.data }, 'https://eunbin.evida.site');
        window.close();
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };
    fetchUser();
  }, []);

  // 부모창: 새창 메시지 수신
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://eunbin.evida.site') return;
      if (event.data.user) {
        setAuthData(event.data.user);
        navigate('/');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAuthData, navigate]);

  // 부모창: axios 인터셉터로 토큰 만료 감지
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalRequest = err.config;

        if (axios.isAxiosError(err) && err.response?.status === 401 && originalRequest) {
          // 이미 재시도한 요청은 다시 시도하지 않음
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            // refresh 진행 중이면 큐에 대기
            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, originalRequest });
              });
            }

            isRefreshing = true;

            try {
              // 🔹 refresh 요청
              await axios.post(
                'https://backend.evida.site/api/v1/users/auth/refresh',
                {},
                { withCredentials: true },
              );

              // 🔹 대기 중인 요청 재시도
              processQueue();

              // 🔹 현재 요청 재시도
              return axios(originalRequest);
            } catch (refreshError) {
              // refresh 실패 → 큐 요청도 실패 처리, 안전하게 로그아웃
              processQueue(refreshError);
              logout();
              localStorage.removeItem('user');
              navigate('/login');
              return Promise.reject(refreshError);
            } finally {
              isRefreshing = false;
            }
          }
        }

        return Promise.reject(err);
      },
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, navigate]);

  // Zustand 상태 변경 시 로컬 업데이트
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return <></>;
}
