import { useNavigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { useEffect } from 'react';
import axios from 'axios';

export default function AppContent() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  //로컬에서 로그인 상태 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setAuthData(JSON.parse(savedUser));
    }
  }, [setAuthData]);

  //새창
  useEffect(() => {
    const fetchUser = async () => {
      if (!window.opener) return;
      try {
        const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
          withCredentials: true,
        });
        //부모창에 전달
        window.opener.postMessage({ user: res.data }, 'https://eunbin.evida.site'); //배포시 도메인변경
        window.close();
      } catch (err) {
        console.error('사용자 정보 불러오기 실패', err);
      }
    };
    fetchUser();
  }, []);

  //부모창
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

  // 부모창: axios 인터셉터에서 만료 감지
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          try {
            await axios.post(
              'https://backend.evida.site/api/v1/users/auth/refresh',
              {},
              { withCredentials: true },
            );
            return err.config ? axios(err.config) : Promise.reject(err); // 원래 요청 재시도
          } catch {
            logout();
            localStorage.removeItem('user'); // 새로고침 대비
            navigate('/login');
          }
        }
        return Promise.reject(err);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [logout, navigate]);

  //상태변경시 로컬 업데이트
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return <></>;
}
