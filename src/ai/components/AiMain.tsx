import { AnimatePresence, motion } from 'framer-motion';
import { useChat } from '../hook/useChat';
import { StartCommand } from '../types/types';
import ActionGrid from './aimain/ActionGrid';
import { ACTIONS } from '../constants/actions';
import ActionCard from './aiside/ActionCard';
import ChatHeader from './aimain/ChatHeader';
import MessageList from './aimain/MessageList';
import InputBar from './aimain/InputBar';

export default function AiMain({ externalCommand }: { externalCommand?: StartCommand | null }) {
  const { view, selectedAction, messages, inputRef, startChat, backHome, send } =
    useChat(externalCommand);

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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-rows-[auto_1fr] h-full"
          >
            <ChatHeader title={selectedAction?.title ?? '대화'} onBack={backHome} />
            <div className="grid grid-rows-[1fr_auto] bg-white">
              <MessageList messages={messages} />
              <InputBar inputRef={inputRef} onSend={send} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
