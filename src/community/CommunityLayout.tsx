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
      <nav className="sticky inset-x-0 z-30 bg-white" style={{ top: 'var(--site-header-h, 70px)' }}>
        <div className="mx-auto w-full max-w-[1100px] sm:px-6 lg:px-8 h-22 flex items-center">
          <div className="h-10 overflow-x-auto whitespace-nowrap no-scrollbar pl-4 md:pl-8 lg:pl-40">
            <CommunityTab />
          </div>
        </div>
      </nav>

      <div className="mx-auto mt-16 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,720px)] gap-8 lg:max-w-[1100px] lg:mx-auto">
          <aside
            className="order-1 lg:order-1 hidden lg:block w-[320px] sticky self-start"
            style={{
              top: 'calc(var(--site-header-h, 68px) + 80px)',
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
