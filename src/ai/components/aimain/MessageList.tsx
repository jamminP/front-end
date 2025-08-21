import { Msg } from '@src/ai/types/types';
import Bubble from './Bubble';

export default function MessageList({ messages }: { messages: Msg[] }) {
  return (
    <div className="overflow-y-auto p-4 bg-white/50">
      <div className="max-w-screen-md mx-auto space-y-3">
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} />
        ))}
      </div>
    </div>
  );
}
