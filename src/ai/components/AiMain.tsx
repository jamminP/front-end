import { AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaCalendarCheck, FaChevronLeft, FaPaperPlane, FaSearch } from 'react-icons/fa';
import { FaRegFileLines } from 'react-icons/fa6';
import { MdQuiz } from 'react-icons/md';
import { motion } from 'framer-motion';
import ActionCard from './ActionCard';
import Bubble from './Bubble';

type ActionId = 'plan' | 'quiz' | 'summary' | 'research';

const ACTIONS: {
  id: ActionId;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number }>;
  firstPrompt: string;
}[] = [
  {
    id: 'plan',
    title: '공부 계획',
    desc: '목표/일정/가용시간을 기반으로 학습 플랜을 생성합니다.',
    icon: FaCalendarCheck,
    firstPrompt: '어떤 공부 계획을 원하시나요? 과목/기간/하루 가능 시간을 알려주세요.',
  },
  {
    id: 'quiz',
    title: '예상 문제',
    desc: '출제 가능성이 높은 문제를 만들어 드려요.',
    icon: MdQuiz,
    firstPrompt: '어떤 주제의 예상 문제를 원하시나요? 난이도/문항수도 알려주세요.',
  },
  {
    id: 'summary',
    title: '정보 요약',
    desc: '긴 글/강의 내용을 한 눈에 보이게 요약합니다.',
    icon: FaRegFileLines,
    firstPrompt: '어떤 내용을 요약할까요? 텍스트나 핵심 포인트를 붙여 넣어주세요.',
  },
  {
    id: 'research',
    title: '리서드파인만 AI',
    desc: '자신이 공부했던 것을 다른 이에게 알려주며 학습을 진행합니다.',
    icon: FaSearch,
    firstPrompt: '어떤 주제를 조사할까요? 범위/목적/관심 키워드를 알려주세요.',
  },
];

type Msg = { id: string; role: 'assistant' | 'user'; text: string; ts: number };

export default function AiMain() {
  const [view, setView] = useState<'home' | 'chat'>('home');
  const [selected, setSelected] = useState<ActionId | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedAction = useMemo(() => ACTIONS.find((a) => a.id === selected) ?? null, [selected]);
  const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const startChat = (id: ActionId) => {
    const a = ACTIONS.find((x) => x.id === id)!;
    setSelected(id);
    setView('chat');
    setMessages([{ id: uid(), role: 'assistant', text: a.firstPrompt, ts: Date.now() }]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const backHome = () => {
    setView('home');
    setSelected(null);
    setMessages([]);
  };

  const send = () => {
    const val = inputRef.current?.value?.trim();
    if (!val) return;
    const userMsg: Msg = { id: uid(), role: 'user', text: val, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    if (inputRef.current) inputRef.current.value = '';

    // 실제 API 연동 위치
    // await callChatAPI({ action: selectedAction?.id, messages: [...messages, userMsg] })
    // setMessages([...prev, userMsg, { id: uid(), role: 'assistant', text: res.text, ts: Date.now() }])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: 'assistant',
          text: `좋아요! “${val}”에 대해 더 알려주시면 계획을 정교화할게요.`,
          ts: Date.now(),
        },
      ]);
    }, 300);
  };

  const focusInput = () => {
    inputRef.current?.focus();
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (view !== 'chat') return;

      if (e.isComposing) return;

      const t = e.target as HTMLElement | null;

      const typing =
        !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);

      if (e.key === 'Enter') {
        e.preventDefault();
        focusInput();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [view]);

  return (
    <div className="h-full grid grid-rows-[1fr_auto]">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.section
            key="home"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="overflow-y-auto"
          >
            <div className="max-w-screen-xl mx-auto px-6 py-8">
              <h1 className="text-2xl font-bold">무엇을 도와드릴까요?</h1>
              <p className="text-gray-600 mt-2">
                학습 플랜 수립부터 요약·문제 생성·리서치까지 한 곳에서 시작하세요.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACTIONS.map((a) => (
                  <ActionCard key={a.id} {...a} onClick={() => startChat(a.id)} />
                ))}
              </div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="chat"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-rows-[auto_1fr] h-full"
          >
            <div className="h-12 flex items-center gap-2 px-4 border-b  bg-[#1B3043]">
              <button
                onClick={backHome}
                className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-[#2a4864]"
                aria-label="뒤로"
              >
                <FaChevronLeft color="white" />
              </button>
              <div className="font-semibold text-[#fff]">{selectedAction?.title ?? '대화'}</div>
            </div>

            <div className="grid grid-rows-[1fr_auto] bg-[#fff]">
              <div className="overflow-y-auto p-4 bg-white/50">
                <div className="max-w-screen-md mx-auto space-y-3">
                  {messages.map((m) => (
                    <Bubble key={m.id} role={m.role} text={m.text} />
                  ))}
                </div>
              </div>

              <div className="border-t bg-white p-3">
                <div className="max-w-screen-md mx-auto flex items-center gap-2">
                  <input
                    ref={inputRef}
                    placeholder="Evi 에게 물어보세요"
                    onKeyDown={(e) => e.key === 'Enter' && send()}
                    className="flex-1 h-11 rounded-xl border border-[#1B3043] px-4 outline-none focus:ring-1 focus:ring-[#2a4864]"
                  />
                  <button
                    onClick={send}
                    className="h-11 px-4 rounded-xl bg-[#1B3043] text-white font-medium hover:opacity-95 active:opacity-90"
                  >
                    <span className="inline-flex items-center gap-2">
                      보내기 <FaPaperPlane />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
