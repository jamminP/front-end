import Logo from '../img/Logo.png';
import { Link } from 'react-router-dom';

export default function HeroRending() {
  const colorVars = { '--main': '#1B3043', '--accent': '#0180F5' } as React.CSSProperties;

  return (
    <section
      style={colorVars}
      className="relative overflow-hidden bg-white w-full min-h-[calc(100svh-72px)]"
    >
      <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl bg-[radial-gradient(closest-side,var(--accent),transparent_70%)]" />

      <div className="mx-auto max-w-screen-xl px-6 md:px-10 py-16 md:py-28 grid gap-10 md:grid-cols-2 place-items-center md:place-items-start">
        <div className="w-full text-center md:text-left">
          <h1 className="mt-4 text-4xl md:text-5xl leading-tight font-extrabold text-[var(--main)]">
            새로운 학습의 시작, <br />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--accent),#4aa6ff)]">
              Evi. AI
            </span>
          </h1>
          <p className="mt-5 text-base md:text-lg leading-7 text-zinc-600">
            목표·일정·가용 시간을 기반으로 나만의 학습 플랜을 만들어 드립니다. <br />
            요약, 퀴즈 생성, 자료 조사까지 한 번에.
          </p>

          <div className="mt-8 flex gap-3 justify-center md:justify-start">
            <Link
              to="/login"
              className="block w-4/5 rounded-xl px-6 py-3 text-center font-semibold border border-[var(--main)] text-[var(--main)] bg-white hover:shadow hover:bg-[#1b3043d0] hover:text-white transition"
            >
              시작하기
            </Link>
          </div>

          <p className="mt-3 text-xs text-zinc-500 text-center md:text-left">
            로그인 페이지에서 Google · Kakao 중 원하는 방식으로 진행하세요.
          </p>
        </div>

        <div className="relative w-full">
          <div className="relative z-10 mx-auto aspect-square w-full max-w-[460px]">
            <img src={Logo} alt="AI assistant robot" className="h-full w-full object-contain p-6" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
    </section>
  );
}
