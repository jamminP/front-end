import Robo from '../img/Logo.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function HeroLanding() {
  return (
    <section className="relative overflow-hidden bg-white min-h-[85dvh] flex items-center pb-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]
        [background:linear-gradient(to_right,rgba(27,48,67,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(27,48,67,0.12)_1px,transparent_1px)]
        [background-size:28px_28px]"
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full blur-3xl
        bg-[radial-gradient(closest-side,rgba(1,128,245,0.38),transparent_70%)]"
      />

      <div className="relative mx-auto grid max-w-screen-2xl w-full items-center gap-12 px-8 md:px-16 md:[grid-template-columns:1.2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full text-center md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium border-[var(--accent)] text-[var(--accent)] bg-[rgba(1,128,245,0.08)]">
            AI 학습 도우미
          </span>

          <div className="max-w-xl sm:max-w-2xl">
            <h1
              id="hero-title"
              className="mt-4 text-5xl md:text-5xl xl:text-7xl font-extrabold leading-[1.12] text-[var(--main)] break-keep text-balance"
            >
              새로운 학습의 시작,
              <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,var(--accent),#4aa6ff)] whitespace-nowrap">
                <span> </span>Evi. AI
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl leading-8 text-zinc-600">
              목표·일정·가용 시간을 기반으로 나만의 학습 플랜을 만들어 드립니다. <br />
              요약, 퀴즈 생성, 자료 조사까지 한 번에.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap justify-center md:justify-start gap-3">
            <Link
              to="/login"
              className="rounded-xl px-6 py-3 font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition shadow-sm"
            >
              시작하기
            </Link>
            <button
              onClick={() =>
                document.getElementById('main')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="rounded-xl px-6 py-3 font-semibold border border-zinc-200 text-[var(--main)] bg-white hover:shadow transition"
            >
              기능 살펴보기
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--accent)]" /> AI와 함께 플랜 생성
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-[var(--accent)]" /> 커뮤니티에 공유하며 성장
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 mx-auto aspect-square w-full max-w-[620px] rounded-full animate-pulse opacity-40 bg-[radial-gradient(closest-side,rgba(1,128,245,0.25),transparent_70%)]" />
          <div className="relative z-10 mx-auto aspect-square w-full max-w-[560px] rounded-3xl border border-zinc-100 bg-[radial-gradient(circle_at_30%_30%,#f8fbff,white_60%)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <img
              src={Robo}
              alt="AI assistant robot"
              className="h-full w-full object-contain p-6 md:p-7"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
