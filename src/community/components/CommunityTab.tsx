import { NavLink } from 'react-router-dom';

const tabs = [
  { lable: '전체', path: '/community' },
  { lable: '자료공유', path: '/community/share' },
  { lable: '자유', path: '/community/free' },
  { lable: '스터디', path: '/community/study' },
];

const CommunityTab = () => {
  return (
    <div>
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          end={tab.path === '/community'}
          className={({ isActive }) =>
            `text-m font-medium  pb-1 ps-7  ${
              isActive
                ? 'text-[#0180F5] font-bold border-blue-600'
                : 'text-gray-500 border-transparent hover:text-[#0180F5] '
            }`
          }
        >
          {tab.lable}
        </NavLink>
      ))}
    </div>
  );
};

export default CommunityTab;
