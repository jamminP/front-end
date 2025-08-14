export default function Bubble({ role, text }: { role: 'assistant' | 'user'; text: string }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
          isUser ? 'bg-[#0180F5] text-white' : 'bg-white'
        }`}
      >
        {text}
      </div>
    </div>
  );
}
