import { useState } from 'react';
import AiMain from './components/AiMain';
import AiSideBar from './components/AiSideBar';
import type { ActionId, StartCommand } from './types/types';

export default function AiPage() {
  const [collapsed, setCollaped] = useState<boolean>(false);
  const [cmd, setCmd] = useState<StartCommand | null>(null);

  const startFromSidebar = (id: ActionId) =>
    setCmd({ type: 'start', actionId: id, token: Date.now() });

  return (
    <div className="h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-screen-3xl h-full grid md:grid-cols-[auto_1fr] gap-3 p-3">
        <aside
          className={[
            'hidden md:block h-full',
            'sticky top-3 self-start',
            'transition-[width,margin] duration-300 ease-in-out',
            collapsed ? 'w-16' : 'w-72',
            'bg-white rounded-2xl border border-black/5 ring-1 ring-black/5 shadow-sm',
            'relative overflow-visible',
          ].join(' ')}
        >
          <AiSideBar
            collapsed={collapsed}
            onToggle={() => setCollaped((v) => !v)}
            onSelectAction={startFromSidebar}
          />
        </aside>

        <main className="h-full bg-white rounded-2xl border border-black/5 ring-1 ring-black/5 shadow-sm">
          <AiMain externalCommand={cmd} />
        </main>
      </div>
    </div>
  );
}
