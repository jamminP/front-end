import googleIcon from '../login/img/google-icon.png';
import kakaoIcon from '../login/img/kakao-icon.png';

export default function Login() {
  const isMobile = window.innerWidth <= 768;
  const width = isMobile ? window.innerWidth : window.innerWidth * 0.35;
  const height = isMobile ? window.innerHeight : window.innerHeight * 0.7;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const handleGoogleLogin = () => {
    window.open(
      'https://backend.evida.site/api/v1/users/auth/google/login',
      'googleLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  };
  const handleKakaoLogin = () => {
    window.open(
      'https://backend.evida.site/api/v1/users/auth/kakao/login',
      'kakaoLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    );
  };
  return (
    <section className="w-full h-screen max-w-[1400px] m-auto flex flex-col justify-center items-center">
      <h1 className="mb-[30px] text-3xl md:text-4xl tracking-[-.15rem] font-bold text-[#313131]">
        로그인
      </h1>
      <div className="w-full flex flex-col items-center">
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#ececec] p-[12px_20px] rounded-full mb-[20px] cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <img src={googleIcon} className="absolute left-[15px]" />
          <span className="font-medium text-sm cursor-pointer">Google로 로그인</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#fae100] p-[12px_20px] rounded-full cursor-pointer"
          onClick={handleKakaoLogin}
        >
          <img src={kakaoIcon} className="absolute left-[17px]" />
          <span className="font-medium text-sm cursor-pointer">Kakao로 로그인</span>
        </button>
      </div>
    </section>
  );
}
