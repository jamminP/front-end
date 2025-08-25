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
      <nav className="sticky inset-x-0 z-30 bg-white top-14 md:top-20">
        <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 lg:px-8 h-14 flex items-center">
          <CommunityTab category={category} />
        </div>
      </nav>

      <div className="mx-auto mt-16 md:mt-22 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,720px)] gap-8 lg:max-w-[1100px] lg:mx-auto">
          {/* 사이드탭: lg 이상에서만 표시 */}
          <aside
            className="order-1 lg:order-1 hidden lg:block w-[320px] sticky self-start"
            style={{ top: 'calc(var(--site-header-h, 70px) + 56px)' }}
          >
            <SidebarRanking />
          </aside>

          <main className="order-2 lg:order-2 w-full relative">
            <Outlet />

            <CreatePostButton
              category={category}
              to="/community/create"
              className="
                hidden lg:flex items-center justify-center
                absolute right-0 translate-x-14 top-8 -translate-y-1/2
                h-12 w-12 rounded-full
              "
            />
          </main>
        </div>
      </div>

      <CreatePostButton
        category={category}
        to="/community/create"
        className="lg:hidden fixed right-6 bottom-18 z-40 h-14 w-14 rounded-full"
      />
    </div>
  );
};

export default CommunityLayout;
