import { Outlet, useLocation } from 'react-router-dom';
import CommunityTab from './components/CommunityTab';
import SidebarRanking from './components/SidebarRanking';
import CreatePostButton from './components/CreatePostButton';

const CommunityLayout = () => {
  const location = useLocation();

  const category: 'free' | 'share' | 'study' = location.pathname.includes('/share')
    ? 'share'
    : location.pathname.includes('/study')
      ? 'study'
      : 'free';

  return (
    <div className="w-full flex justify-center px-4 pt-30">
      <div className="w-full max-w-[1000px]">
        {/* 상단 커뮤니티 탭 */}
        <div className="text-center py-2">
          <CommunityTab />
        </div>

        <div className="flex justify-center gap-10 mt-6">
          {/* 좌측 인기글 */}
          <div className="w-[240px]">
            <SidebarRanking />
          </div>

          {/* 본문 */}
          <main className="flex-1 max-w-[600px]">
            <div className="text-sm text-gray-700" />
            <Outlet />
          </main>
          <CreatePostButton
            category={category}
            to="/community/create"
            className="inline-flex self-start h-9 px-3 py-1 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CommunityLayout;
