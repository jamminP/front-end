// src/ai/components/AiMain.tsx
import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '../hook/useChat';
import { StartCommand } from '../types/types';
import ActionGrid from './aimain/ActionGrid';
import { ACTIONS } from '../constants/actions';
import ActionCard from './aiside/ActionCard';
import ChatHeader from './aimain/ChatHeader';
import MessageList from './aimain/MessageList';
import InputBar from './aimain/InputBar';
import PlanComposer from './aimain/PlanComposer';

export default function AiMain({ externalCommand }: { externalCommand?: StartCommand | null }) {
  const { view, selectedAction, messages, inputRef, startChat, backHome, send, appendAssistant } =
    useChat(externalCommand);

  return (
    <div className="h-full grid grid-rows-[1fr] overflow-y-auto [scrollbar-gutter:stable]">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.section
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-y-auto"
          >
            <ActionGrid
              title="무엇을 도와드릴까요?"
              subtitle="학습 플랜 수립부터 요약까지 한 곳에서 시작하세요."
            >
              {ACTIONS.map((a) => (
                <ActionCard key={a.id} {...a} onClick={() => startChat(a.id)} />
              ))}
            </ActionGrid>
          </motion.section>
        ) : (
          <motion.section
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <div className="grid grid-rows-[auto_1fr_auto] h-full bg-white rounded-2xl border divide-y overflow-hidden">
              <ChatHeader title={selectedAction?.title ?? '대화'} />
              <div className="min-h-0">
                <MessageList messages={messages} />
              </div>

              {selectedAction?.id === 'plan' ? (
                <PlanComposer
                  onSubmitted={(req, msg, output) => {
                    appendAssistant(
                      `아래 내용으로 학습 계획 생성을 요청했어요:\n` +
                        '```json\n' +
                        JSON.stringify(req, null, 2) +
                        '\n```\n' +
                        (msg ? `서버 응답: ${msg}\n` : '') +
                        (output
                          ? `생성된 output_data:\n\`\`\`json\n${output}\n\`\`\``
                          : '서버에서 output_data를 받지 못했습니다.'),
                    );
                  }}
                />
              ) : (
                <InputBar inputRef={inputRef} onSend={send} />
              )}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
