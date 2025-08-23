import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GrPlan } from 'react-icons/gr';
import SidebarItem from './aiside/AISideItem';
import { FaRegFileLines } from 'react-icons/fa6';
import ChatList from './aiside/ChatList';
import type { ActionId } from '../types/types';
import { useResolvedNickname } from '../hook/useUserProfile';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  onSelectAction: (id: ActionId) => void;
};

const ACCENT = '#1B3043';
const PANEL = 'bg-white rounded-2xl ring-1 ring-slate-200 shadow-sm';

export default function AiSideBar({ collapsed, onToggle, onSelectAction }: Props) {
  const nickname = useResolvedNickname();

  return (
    <div className={`${PANEL} relative flex flex-col w-full h-full`}>
      <div className="h-12 flex items-center justify-between px-2">
        <button
          onClick={onToggle}
          className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ outlineColor: ACCENT }}
          aria-label={collapsed ? '사이드바 열기' : '사이드바 접기'}
          title={collapsed ? '열기' : '접기'}
        >
          {collapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
        </button>
      </div>

      <nav className="px-1.5 pb-2 space-y-1">
        <SidebarItem
          icon={<GrPlan size={20} />}
          label="공부 계획"
          collapsed={collapsed}
          onClick={() => onSelectAction('plan')}
        />
        <SidebarItem
          icon={<FaRegFileLines size={20} />}
          label="정보 요약"
          collapsed={collapsed}
          onClick={() => onSelectAction('summary')}
        />
      </nav>

      <section className={collapsed ? 'px-0 py-3' : 'px-2.5 py-3'}>
        {!collapsed && (
          <h3 className="mb-2 px-1 text-[11px] font-semibold tracking-wide text-slate-500">채팅</h3>
        )}
        <ChatList collapsed={collapsed} />
      </section>

      <div
        className={[
          'mt-auto mb-3 flex items-center',
          collapsed ? 'justify-center' : 'px-3 gap-3',
        ].join(' ')}
      >
        <div className="w-8 h-8 rounded-full bg-slate-200" />
        {!collapsed && <p className="text-sm font-medium text-slate-800">{nickname}</p>}
      </div>
    </div>
  );
}
