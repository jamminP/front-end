export default function ChatHeader({ title }: { title: string }) {
  return (
    <div className="h-14 sticky top-0 z-10 bg-gradient-to-r from-[#172b3a] to-[#0f2030] border-b border-black/10">
      <div className="h-full mx-auto px-4 flex items-center">
        <div className="text-white text-xl font-semibold tracking-tight pl-3">Evi. Thinking</div>
      </div>
    </div>
  );
}
