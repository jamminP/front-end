import { useState } from 'react';
import AiMain from './components/AiMain';
import AiSideBar from './components/AiSideBar';

export default function AiPage() {
  const [collapsed, setCollaped] = useState<boolean>(false);

  return (
    <div className="pt-30 w-full h-screen flex flex-col md:flex-row">
      <aside
        className={[
          'hidden md:flex h-full bg-white border-r border-amber-100',
          'transition-all duration-300 ease-in-out',
          'relative overflow-visible',
          collapsed ? 'md:w-16' : 'md:w-64',
        ].join(' ')}
      >
        <AiSideBar collapsed={collapsed} onToggle={() => setCollaped((view) => !view)} />
      </aside>
      <main className="flex-1 h-full bg-amber-50">
        <AiMain />
      </main>
    </div>
  );
}
