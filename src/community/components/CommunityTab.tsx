import { NavLink } from 'react-router-dom';
import SearchIcon from './SearchIcon';
import type { PostCategory } from '../api/types';

const tabs = [
  { lable: '전체', path: '/community' },
  { lable: '자료공유', path: '/community/share' },
  { lable: '자유', path: '/community/free' },
  { lable: '스터디', path: '/community/study' },
];

export default function CommunityTab({ category }: { category: PostCategory }) {
  return (
    <div className="w-full flex items-center gap-2">
      <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
        <nav className="flex flex-nowrap items-center gap-6 justify-center">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/community'}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap break-keep inline-flex items-center
                 px-1.5 text-base pb-1 border-b-2
                 ${
                   isActive
                     ? 'text-[#0180F5] border-blue-600 font-bold'
                     : 'text-gray-500 border-transparent hover:text-[#0180F5]'
                 }`
              }
            >
              {tab.lable}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="shrink-0 ml-2">
        <SearchIcon category="all" />
      </div>
    </div>
  );
}
