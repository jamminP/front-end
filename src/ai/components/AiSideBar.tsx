import { FaChalkboardTeacher, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GrPlan } from 'react-icons/gr';
import { MdQuiz } from 'react-icons/md';
import SidebarItem from './AISideItem';
import { FaRegFileLines } from 'react-icons/fa6';
import ChatList from './ChatList';

type Props = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function AiSideBar({ collapsed, onToggle }: Props) {
  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="h-10 flex items-center justify-between px-3">
        <button
          onClick={onToggle}
          className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          {collapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
        </button>
      </div>

      <nav className="py-3">
        <SidebarItem icon={<GrPlan size={20} />} label="공부 계획" collapsed={collapsed} />
        <SidebarItem icon={<MdQuiz size={20} />} label="예상 문제" collapsed={collapsed} />
        <SidebarItem icon={<FaRegFileLines size={20} />} label="정보 요약" collapsed={collapsed} />
        <SidebarItem
          icon={<FaChalkboardTeacher size={20} />}
          label="리처드파인만 AI"
          collapsed={collapsed}
        />
      </nav>
      <section className={collapsed ? 'px-0 py-3' : 'px-3 py-3'}>
        {!collapsed && <h3 className="mb-2 text-xs font-semibold text-gray-600">채팅</h3>}
        <ChatList collapsed={collapsed} />
      </section>

      <div className={['mt-auto mb-3 flex', collapsed ? 'flex justify-center' : 'px-3'].join(' ')}>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
        {collapsed ? '' : <p className="ml-3 mt-0.5 text-xl">닉네임</p>}
      </div>
    </div>
  );
}
