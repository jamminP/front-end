// /auth/Callback.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuthStore from '../store/authStore';

export default function GoogleCallback() {
  const [sp] = useSearchParams(); // 배열 구조분해
  const navigate = useNavigate();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const code = sp.get('code');
  const state = sp.get('state');

  useEffect(() => {
    if (!code || !state) return; // null 체크

    (async () => {
      try {
        // 백엔드 콜백 XHR 호출
        const res = await axios.post(
          'https://backend.evida.site/api/v1/users/auth/google/callback',
          { code, state },
          { withCredentials: true }, // 쿠키 사용 시 필요
        );

        // 백엔드에서 { accessToken, user } 반환 가정
        const { accessToken, user } = res.data;

        // sessionStorage에 토큰 저장
        sessionStorage.setItem('access_token', accessToken);

        // Zustand 상태에도 token 저장
        setAuthData({ user, token: accessToken });

        // URL 쿼리 제거 & 홈 이동
        window.history.replaceState({}, '', '/');
        navigate('/');
      } catch (error) {
        console.error('OAuth 로그인 실패:', error);
        navigate('/login?error=oauth');
      }
    })();
  }, [code, state, setAuthData, navigate]);

  return <p>로그인 처리 중…</p>;
}
