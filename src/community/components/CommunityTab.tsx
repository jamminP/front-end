import { NavLink } from 'react-router-dom';
import SearchIcon from './SearchIcon';

const tabs = [
  { lable: '전체', path: '/community' },
  { lable: '자료공유', path: '/community/share' },
  { lable: '자유', path: '/community/free' },
  { lable: '스터디', path: '/community/study' },
];

const CommunityTab = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-center">
        <span className="inline-block w-8" aria-hidden />
        <nav className="flex items-center mx-70 gap-6">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              end={tab.path === '/community'}
              className={({ isActive }) =>
                `text-base font-medium pb-1
              border-b-2 ${isActive ? 'text-[#0180F5] border-blue-600 font-bold' : 'text-gray-500 border-transparent hover:text-[#0180F5]'}`
              }
            >
              {tab.lable}
            </NavLink>
          ))}
        </nav>

        <div>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default CommunityTab;
