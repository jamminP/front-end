import { useNavigate } from 'react-router-dom';
import googleIcon from '../login/img/google-icon.png';
import kakaoIcon from '../login/img/kakao-icon.png';
import useAuthStore from '@src/store/authStore';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const setAuthData = useAuthStore((s) => s.setAuthData);

  const handleGoogleLogin = () => {
    const popup = window.open(
      'https://backend.evida.site/api/v1/users/auth/google/login',
      'google-login',
      'width=500,height=600,scrollbars=yes,resizable=yes',
    );

    const messageListener = async (event: MessageEvent) => {
      if (event.origin !== 'https://backend.evida.site') return;
      if (event.data.type === 'LOGIN_SUCCESS') {
        try {
          const token = event.data.access_token;
          if (!token) throw new Error('Access token 없음');

          localStorage.setItem('access_token', token);

          const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo', {
            headers: { Authorization: `Bearer ${token}` },
          });

          setAuthData({ user: res.data, token });
          popup?.close();
          navigate('/');
        } catch (err) {
          console.error('로그인 처리 실패:', err);
        } finally {
          window.removeEventListener('message', messageListener);
        }
      }
    };

    window.addEventListener('message', messageListener);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
      }
    }, 500);
  };

  return (
    <section className="w-full h-screen max-w-[1400px] m-auto flex flex-col justify-center items-center">
      <h1 className="mb-[30px] text-3xl md:text-4xl tracking-[-.15rem] font-bold text-[#313131]">
        로그인
      </h1>
      <div className="w-full flex flex-col items-center">
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#ececec] p-[12px_20px] rounded-full mb-[20px]"
        >
          <img src={googleIcon} className="absolute left-[15px]" />
          <span onClick={handleGoogleLogin} className="font-medium text-sm cursor-pointer">
            Google로 로그인
          </span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#fae100] p-[12px_20px] rounded-full"
        >
          <img src={kakaoIcon} className="absolute left-[17px]" />
          <span className="font-medium text-sm cursor-pointer">Kakao로 로그인</span>
        </button>
      </div>
    </section>
  );
}
