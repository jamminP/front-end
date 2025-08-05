import googleIcon from "../login/img/google-icon.png";
import kakaoIcon from "../login/img/kakao-icon.png";

export default function Login() {
  return (
    <section className="w-full h-full max-w-[1400px] m-auto flex flex-col justify-center items-center">
      <h1 className="mb-[30px] text-4xl tracking-[-.15rem] font-bold text-[#313131]">
        로그인
      </h1>
      <div className="w-full flex flex-col items-center">
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#ececec] p-[12px_20px] rounded-full mb-[20px]"
        >
          <img src={googleIcon} className="absolute left-[15px]" />
          <span className="font-medium text-sm">Google로 로그인</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center relative md:w-[300px] w-[70%] bg-[#fae100] p-[12px_20px] rounded-full"
        >
          <img src={kakaoIcon} className="absolute left-[17px]" />
          <span className="font-medium text-sm">Kakao로 로그인</span>
        </button>
      </div>
    </section>
  );
}
