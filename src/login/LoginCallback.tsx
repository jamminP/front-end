import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LoginCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) return;

    (async () => {
      try {
        const res = await fetch('/api/v1/users/auth/google/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auth_code: code }),
        });

        if (!res.ok) throw new Error(`Login failed: ${res.status}`);

        interface LoginResponse {
          user: {
            id: string;
            email: string;
            name: string;
            // 필요한 필드 추가
          };
          access_token: string;
          refresh_token: string;
        }

        const data: LoginResponse = await res.json();

        setAuthData({
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        navigate('/'); // 홈으로 이동
      } catch (err) {
        console.error(err);
        navigate('/login?error=failed');
      }
    })();
  }, [searchParams, setAuthData, navigate]);

  return <div>로그인 중...</div>;
}
