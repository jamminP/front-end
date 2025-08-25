import React from 'react';
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
    <div className="w-full">
      {/* 상단 sticky 바: 높이 안정화 (h-14 = 56px) */}
      <nav className="sticky inset-x-0 z-30 bg-white top-20">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <CommunityTab />
        </div>
      </nav>

      {/* 본문 */}
      <div className="mx-auto mt-22 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,720px)] gap-8 lg:max-w-[1100px] lg:mx-auto">
          <aside
            className="order-1 lg:order-1 hidden lg:block w-[320px] sticky self-start"
            style={{
              // 헤더 + 탭바
              top: 'calc(var(--site-header-h, 70px) + 56px)',
            }}
          >
            <SidebarRanking />
          </aside>

          <main className="order-2 lg:order-2 w-full">
            <Outlet />
          </main>
        </div>
      </div>

      <CreatePostButton
        category={category}
        to="/community/create"
        className="fixed right-4 bottom-20 md:right-10 md:bottom-10 z-40 h-9 px-3 py-1 rounded-lg"
      />
    </div>
  );
};

export default CommunityLayout;
